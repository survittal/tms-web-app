import { getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  where,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

const db = getFirestore(app);

const addDatatoFireStore = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "devotees"), {
      firstname: firstname,
      email: email,
      mobileno: mobileno,
      pincode: pincode,
      address: address,
      city: city,
    });
    console.log("Data Added with Ref ID: ", docRef.id);
    return [true, docRef.id];
  } catch (error) {
    console.error("Error while addding Data ", error);
    return [false, ""];
  }
};

const getDetByMobNo = async (sMobile) => {
  try {
    const dRef = collection(db, "devotees");
    const q = query(
      dRef,
      where("mobileno", "==", sMobile),
      orderBy("mobileno", "desc"),
      limit(5)
    );
    const snapshot = await getDocs(q);
    let data = [];
    if (snapshot.empty) {
      console.log("Mobile Not found...");
      return 0;
    } else {
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return { data };
    }
  } catch (error) {
    console.error("Error while addding Data ", error);
    return 0;
  }
};

const getDetByDocID = async (docID) => {
  try {
    //console.log("util:", docID);
    const dRef = doc(db, "devotees", docID);
    const snapshot = await getDoc(dRef);
    if (snapshot.empty) {
      console.log("No Such Document found ...");
      return 0;
    } else {
      //console.log(snapshot.data());
      return snapshot.data();
    }
  } catch (error) {
    console.error("Error while getting data ", error);
    return 0;
  }
};

export { getDetByMobNo, addDatatoFireStore, getDetByDocID };
