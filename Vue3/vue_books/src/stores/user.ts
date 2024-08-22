import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('counter', () => {
  const token = ref(localStorage.getItem('TOKEN_KEY') || '')
  // const doubleCount = computed(() => count.value * 2)
  // function increment() {
  //   count.value++
  // }
  function setToken(value:string){
    console.log(value);
    token.value = value
  }
  return { token,setToken }
})
