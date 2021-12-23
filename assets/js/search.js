
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
    created() {
        document.title = this.query ? TITLE_PAGE + '-' + this.query : TITLE_PAGE
        this.search(this.query , this.currentPage)
    },
    methods : {
        submit(){
            this.$refs.form.submit()
        },
        getQueryParams(start){
            return {
                q: this.query,
                api_key : 'c85b85d83906a6e3b418af940d58b706dc08520e8456f2c0e8be907c967a8a4f',
                start : 1,
                num : 10
            }
        },
        search(keyword = '' , start = 1, img=undefined){
            var url = new URL(URL_API)
            url.search = new URLSearchParams(this.getQueryParams(start)).toString();
            if (keyword && keyword !== '') {
                fetch(url , {
                    mode: 'cors',
                    headers: {
                        "accept" : 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                        "user-agent" : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36',
                        "credentials": "same-origin"
                    }
                }).then(response => response.json()).then(data => console.log(data))
            //    this.getAllData()
            }
        },
        async getAllData(){
            const result  = []
            try{
                for(let i = 1; i <= LIMIT_RESULT ; i++){
                    var url = new URL(URL_API)
                    url.search = new URLSearchParams(this.getQueryParams(i)).toString();
                    const data = await axios.get(url).then(Response =>{
                        result.push(Response.data.items)
                    })
                    await this.sleep(1000);
                }
            } catch(error) {
                console.log(error)
            }
            const merged = [].concat.apply([], result);
            this.items = merged;    // display all result
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
        },
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
    }
})