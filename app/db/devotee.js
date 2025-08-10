import { getFirestore } from "firebase/firestore";
import { app } from "../firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  getDocs,
  where,
  query,
  orderBy,
  limit,
} from "firebase/firestore";

const db = getFirestore(app);

const addDatatoFireStore = async (
  firstname,
  email,
  mobileno,
  pincode,
  address,
  city
) => {
  try {
    const fName = firstname;
    const docRef = await addDoc(collection(db, "devotees"), {
      firstname: firstname,
      firstnamelower: fName.toLowerCase(),
      email: email,
      mobileno: mobileno,
      pincode: pincode,
      address: address,
      city: city,
      user_level: "0",
    });
    //console.log("Data Added with Ref ID: ", docRef.id);
    return [true, docRef.id];
  } catch (error) {
    //console.error("Error while addding Data ", error);
    return [false, ""];
  }
};

const getAllDevotees = async (sString) => {
  try {
    const dRef = collection(db, "devotees");
    let q = null;
    if (sString === null) {
      q = query(dRef, orderBy("firstname"));
    } else {
      q = query(dRef, where("user_level", "==", sString), orderBy("firstname"));
    }
    const snapshot = await getDocs(q);
    let data = [];
    if (snapshot.empty) {
      //console.log("No Devotees found...");
      return 0;
    } else {
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return { data };
    }
  } catch (error) {
    //console.error("Error while addding Data ", error);
    return 0;
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
      //console.log("Mobile Not found...");
      return 0;
    } else {
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return { data };
    }
  } catch (error) {
    //console.error("Error while addding Data ", error);
    return 0;
  }
};

const getDetByDocID = async (docID) => {
  try {
    const dRef = doc(db, "devotees", docID);
    const snapshot = await getDoc(dRef);

    if (snapshot.empty) {
      //console.log("--No Such Document found ...");
      return 0;
    } else {
      return { id: snapshot.id, ...snapshot.data() };
    }
  } catch (error) {
    //console.error("Error while getting data ", error);
    return 0;
  }
};

const getSevaDetByDocID = async (parentDocumentId, docID) => {
  try {
    const docRef = doc(db, "devotees/" + parentDocumentId + "/sevadet", docID);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.empty) {
      return 0;
    } else {
      return { id: docSnapshot.id, ...docSnapshot.data() };
    }
  } catch (error) {
    return 0;
  }
};

const updateDocument = async (collectionName, documentId, data) => {
  try {
    const documentRef = doc(db, collectionName, documentId);
    await updateDoc(documentRef, data);
    return { status: 1, msg: "Document updated successfully!" };
  } catch (error) {
    return { status: 0, msg: "Error updating document", error };
  }
};

const getAllSeva = async (docID) => {
  try {
    const dRef = collection(db, "devotees/" + docID + "/sevadet");
    const q = query(dRef, where("order_status", "==", "Unpaid"));
    const result = await getDocs(q);

    let data = [];

    if (result.empty) {
      //console.log("No Seva Documents found ...");
      return 0;
    } else {
      result.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return { data };
    }
  } catch (error) {
    //console.error("Error while getting data ", error);
    return 0;
  }
};

const zeroPad = (num, places) => String(num).padStart(places, "0");

const addNewSevaDet = async (id, data) => {
  try {
    const docRef1 = doc(db, "counters", "doc_counters");
    const qSnap = await getDoc(docRef1);
    const newRNo = qSnap.data().r_no + 1;
    await updateDoc(docRef1, { r_no: newRNo });

    let rNum;
    rNum = new Date().getFullYear() + zeroPad(newRNo, 5);

    const docRef = await addDoc(collection(db, "devotees/" + id + "/sevadet"), {
      receipt_no: rNum,
      ...data,
    });
    //console.log("New Ref:", docRef.id);
    return { id: docRef.id };
  } catch (error) {
    //console.error("Error occurred", error);
    return { id: 0 };
  }
};

const shortDate = (inputDt) => {
  const longDate = new Date(inputDt);
  const customDateFormatter = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const customShortDate = customDateFormatter.format(longDate);
  return customShortDate;
};

const shortDateTime = (inputDt) => {
  const longDate = new Date(inputDt);
  const customDateFormatter = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
  });
  const customShortDate = customDateFormatter.format(longDate);
  return customShortDate;
};

export {
  getDetByMobNo,
  addDatatoFireStore,
  getDetByDocID,
  getAllSeva,
  getSevaDetByDocID,
  updateDocument,
  addNewSevaDet,
  shortDate,
  shortDateTime,
  getAllDevotees,
};
