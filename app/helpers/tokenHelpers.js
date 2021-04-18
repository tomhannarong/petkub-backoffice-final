

export const checkTokenExpired = (exp) =>{

    if (Date.now() <= exp * 1000) {
    //   token is not expired
      return false
    } else { 
    //   token is expired
      return true

    }
  }