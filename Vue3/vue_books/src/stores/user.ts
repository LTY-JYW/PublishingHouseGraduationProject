import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('counter', () => {
  const token = ref(localStorage.getItem('TOKEN_KEY') || '')
  function setToken(value:string){
    console.log(value);
    token.value = value
  }
  return { token,setToken }
})
