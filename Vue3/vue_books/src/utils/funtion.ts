// 返回最后一页
export const lastPage = (total:number,itemsPerPage:number) => {
    if(total+1%itemsPerPage === 0){
        return Math.floor(total/itemsPerPage)
    }else{
        return Math.floor(total/itemsPerPage)+1
    }
}
