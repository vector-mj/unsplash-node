// FIXME:
class ApiFeatures{
    private query: any;
    private queryStr: any;
    private cleanQuery:any;
    private query2:object = {};
    private fi:any;
    private limit:any;
    private sortBy:any;
    private skip:any;
    constructor(query:any,queryStr:any){
        this.query = query;
        this.queryStr = queryStr;
    }
    filter():any{
        // (1) Clear all querys 
        this.cleanQuery = {...this.queryStr};
        let whiteList = ['limit','fields','sort','page'];
        whiteList.forEach(el => delete this.cleanQuery[el]);
        return this;
    }
    sort():any{
        this.sortBy = this.queryStr.sort?(this.queryStr.sort as string).split(",").join(" "):"-accountCreatedAt";
        return this;
    }
    select():any{
        this.fi= this.queryStr.fields?(this.queryStr.fields as String).split(",").join(" "):"-__v";
        return this;
    }
    fields():any{
        let query:string = JSON.stringify(this.cleanQuery);
        this.query2 = JSON.parse(query.replace(/\b(gt|lt|gle|lte)\b/g,match=>`$${match}`));
        return this;
    }
    async pagination():Promise<any>{
        let page:any = this.queryStr.page || 1;
        let limit:any = this.queryStr.limit || 100;
        let skip = (page-1)*limit;
        if(this.queryStr.page){
            const numUsers:number = await this.query.countDocuments();
            if(skip>=numUsers)throw new Error('This page does not exist');
        }
    }
    async result():Promise<any>{
        let users = await this.query.find(this.query2).select(this.fi).skip(this.skip).limit(this.limit*1).sort(this.sortBy);
        return users;
    }
}
export {ApiFeatures};