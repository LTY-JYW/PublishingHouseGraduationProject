import router from '@/router'

// 返回最后一页
export const lastPage = (total: number, itemsPerPage: number) => {
    if (total + 1 % itemsPerPage === 0) {
        return Math.floor(total / itemsPerPage)
    } else {
        return Math.floor(total / itemsPerPage) + 1
    }
}


// 点击图书函数
export const onBooks = (id: number) => {
    router.push(`/booksInfo?id=${id}`)
}
// 点击作者
export const onAuthor = (id: number) => {
    router.push(`/author?id=${id}`)
}

// 点击资讯
export const onInformation = (id: number) => {
    router.push(`/informationInfo?id=${id}`)
}
// 分类点击事件
export const onCategory = (id:number) => {
    router.push(`/category?id=${id}`)
}

// 订单点击事件
export const onOrder = (id:number) => {
    router.push(`/userInfoLayout/userOrderInfo?id=${id}`)
}

// 忘记密码函数
export const forgetThePassword = () => {}