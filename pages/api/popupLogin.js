import { firestore } from "@/config";

import { setCookie } from "cookies-next";
import { setDoc, getDoc, doc } from "firebase/firestore";
export default async (req, res) => {
  console.log("req received");
  var data = JSON.parse(req.body);
  var { uid } = data;
  try {
    var fileInFirestore = doc(firestore, "users", uid);
    var snap = await getDoc(fileInFirestore);
    var userData = snap.data();
    if (snap.exists()) {
      setCookie("cyberLabs_uid", uid, {
        req,
        res,
        maxAge: new Date(Date.now() + 900000),
        httpOnly: false,
        sameSite: "none",
        secure: "true",
      });
      res.json({
        authType: 200,
        message: "Login Successfully",
        data: userData,
      });
    } else {
      await setDoc(doc(firestore, "users", uid), data);
      setCookie("cyberLabs_uid", uid, {
        req,
        res,
        maxAge: new Date(Date.now() + 900000),
        httpOnly: false,
        sameSite: "none",
        secure: "true",
      });
      res.json({
        authType: 200,
        message: "Account Created",
        data: data,
      });
    }
  } catch (e) {
    console.log(e);
    res.json({ message: "Error", authType: 400 });
  }
};
