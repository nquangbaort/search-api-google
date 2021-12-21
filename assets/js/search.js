
const app = new Vue({
    el : '#app',
    data(){
        return{
            items : [],
            urlSearchParams : urlSearchParams,
            query: urlSearchParams.get('q') ?? '',
            perPage: 10,
            totalItems: 0,
            currentPage: urlSearchParams.get('page') ? parseInt(urlSearchParams.get('page')) : 1,
            form : null,
            date : DATE,
            copyRight : COPY_RIGHT,
            errorMessage : null,
        }
    },
    created(){
        document.title = this.query ? TITLE_PAGE + '-' + this.query : TITLE_PAGE
        this.search(this.query , this.currentPage)
    },
    methods : {
        submit(){
            this.$refs.form.submit()
        },
        getQueryParams(start){
            return {
                key: API_KEY,
                cx: CX,
                q: this.query,
                gl: Lang_gl,
                hl: Lang_hl,
                lr: Lang_lr,
                start : start,
                num : COUNT_RESULT
            }
        },
        search(keyword = '' , start = 1,img=undefined){
            var url = new URL(URL_API)
            url.search = new URLSearchParams(this.getQueryParams(start)).toString();
            if (keyword && keyword !== '') {
                const data =  axios.get(url).then(Response =>{
                    const totalItems = parseInt(Math.ceil(Response.data.searchInformation.totalResults / COUNT_RESULT))
                    this.currentPage = start
                    this.totalItems = totalItems
                    this.items = Response.data.items

                }).catch(error => {
                    this.errorMessage = error.data.error.message
                })
               this.getAllData()
            }
        },
       async getAllData(){
            const result  = []
            for(let i = 1; i <= LIMIT_RESULT ; i++){
                var url = new URL(URL_API)
                url.search = new URLSearchParams(this.getQueryParams(i)).toString();
                const data = await axios.get(url).then(Response =>{
                    result.push(Response.data.items)
                })
            }
            const merged = [].concat.apply([], result);
            this.downloadCSVData(merged)
        },
        downloadCSVData(data = [] ){
            const rows = [['title', 'link']];
            for (let i = 0; i < data.length; i++) {
                const item = data[i]
                console.log(item);
                rows.push(['"' + item.title + '"','"' + item.link + '"']);
            }
            let csvContent = "data:text/csv;charset=utf-8,";
            rows.forEach(function(rowArray) {
                let row = rowArray.join(",");
                csvContent += row + "\r\n";
            })
            var encodedUri = encodeURI(csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", NAME_FILE_CSV + '-' + this.query + '-' + 'page-' + this.currentPage + '.csv' );
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    }
})