
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
            csvdata : [],
            form : null,
            date : DATE,
            copyRight : COPY_RIGHT,
            errorMessage : null
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
        async search(keyword = '' , start = 1,img=undefined){
            var url = new URL(URL_API)
            var params = {
                key: API_KEY,
                cx: CX,
                q: keyword,
                gl: Lang_gl,
                hl: Lang_hl,
                lr: Lang_lr,
                start : img ? start*COUNT_RESULT :start
            }
            url.search = new URLSearchParams(params).toString();
            if (keyword && keyword !== '') {
                const data = await axios.get(url).then(Response =>{
                    const totalItems = parseInt(Math.ceil(Response.data.searchInformation.totalResults / COUNT_RESULT))
                    this.currentPage = start
                    this.totalItems = totalItems
                    this.csvdata = Response.data.items
                    this.items = Response.data.items
                    this.downloadCSVData()
                }).catch(error => {
                    console.log(error.data.error.message);
                    this.errorMessage = error.data.error.message
                })
            }          
        },
        downloadCSVData(){
            const rows = [['title', 'link']];
            for (var i = 0; i < this.csvdata.length; i++) {
                var item = this.csvdata[i];
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