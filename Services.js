import { baseURL, token } from "./constant/ConstentValue";


class Services{
    constructor(){
        this.headers = {
          accpet:"Application/json",
          "Content-Type":"application/json",
          "Api-token":token
        }
    }
    async get(url){
        return fetch(baseURL + url, {
            headers:this.headers,
            method:"GET", 
        })
        .then(async (res)=>{
            let resText = await res.text()
            try {
                return JSON.parse(resText);
            } catch (error){
                return resText;
            }
        })
        .catch((err)=>{
            throw new Error(err, 'Services');
        })
    }
    async post(url, body){
        let sendData = {...body}
        return fetch(baseURL+url, {
            headers:this.headers,
            method:"POST",
            body:JSON.stringify(sendData)
        })
        .then(async (res)=>{
            let resText = await res.text()
            try {
              return JSON.parse(resText);
            } catch (error) {
              return resText;
            }
        })
        .catch((err)=>{
            throw new Error(err);
        })
    }
    async formMethod(url, body){
        return fetch(baseURL+url,{
            headers: {accpet:"Application/json", "Api-token":token},
            method:"POST",
            body:body
    })
        .then(async (res)=>{
            let resText = await res.text()
            try {
                return JSON.parse(resText);
            } catch (error) {
                return resText;
            }
    })
        .catch((err)=>{
            throw new Error(err);
    })
    }

    

}
export default Services = new Services();