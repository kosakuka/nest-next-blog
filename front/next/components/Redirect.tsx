import { useRouter } from "next/router";
import React, { useEffect } from "react";
import Cookies from "universal-cookie";

interface PropsIfc{
  alertMsg: string
}

const Redirect = (props: PropsIfc) => {
  const router = useRouter();
  useEffect(() => {
    const cookie = new Cookies();
    if(!cookie.get("access_token")){
      alert(props.alertMsg)
      router.push("/admin");
    }
  }, []);

  return <div>リダイレクトページです</div>;
};

export default Redirect;
