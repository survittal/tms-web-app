import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

function inWords(value) {
    var fraction = Math.round(frac(value)*100);
    var f_text  = "";

    if(fraction > 0) {
        f_text = "And "+convert_number(fraction)+" Paise";
    }
    return convert_number(value)+" Rupee "+f_text+"Only";
}

function frac(f) {
    return f % 1;
}

function convert_number(number)
{
    if ((number < 0) || (number > 999999999)) 
    { 
        return "NUMBER OUT OF RANGE!";
    }
    var Gn = Math.floor(number / 10000000);  /* Crore */ 
    number -= Gn * 10000000; 
    var kn = Math.floor(number / 100000);     /* lakhs */ 
    number -= kn * 100000; 
    var Hn = Math.floor(number / 1000);      /* thousand */ 
    number -= Hn * 1000; 
    var Dn = Math.floor(number / 100);       /* Tens (deca) */ 
    number = number % 100;               /* Ones */ 
    var tn= Math.floor(number / 10); 
    var one=Math.floor(number % 10); 
    var res = ""; 

    if (Gn>0) 
    { 
        res += (convert_number(Gn) + " Crore"); 
    } 
    if (kn>0) 
    { 
            res += (((res=="") ? "" : " ") + 
            convert_number(kn) + " Lakh"); 
    } 
    if (Hn>0) 
    { 
        res += (((res=="") ? "" : " ") +
            convert_number(Hn) + " Thousand"); 
    } 

    if (Dn) 
    { 
        res += (((res=="") ? "" : " ") + 
            convert_number(Dn) + " Hundred"); 
    } 

    var ones = Array("", "One", "Two", "Three", "Four", "Five", "Six","Seven", "Eight", "Nin", "Ten", "Eleven", "Twelve", "Thirteen","Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen","Nineteen"); 
var tens = Array("", "", "Twenty", "Thirty", "Fourty", "Fifty", "Sixty","Seventy", "Eighty", "Ninety"); 

    if (tn>0 || one>0) 
    { 
        if (!(res=="")) 
        { 
            res += " And "; 
        } 
        if (tn < 2) 
        { 
            res += ones[tn * 10 + one]; 
        } 
        else 
        { 

            res += tens[tn];
            if (one>0) 
            { 
                res += ("-" + ones[one]); 
            } 
        } 
    }

    if (res=="")
    { 
        res = "zero"; 
    } 
    return res;
}

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: "12px",
    height: "100px",
  },
  header: {
    textAlign: 'center',
  },
  section: {
    display: "flex",
    flexDirection: "row",
    gap: "5px",
    margin: 1,
    padding: 1,
  },
  section1: {
    display: "flex",
    flexDirection: "row",
    gap: "5px",
    margin: 1,
    padding: 1,
  },
  logo: {
    width: 70,
    height: 70,
    marginTop: "15px",
  },
});

// Create Document Component
export const ReceiptPage = ({data}) => (
  <Document>
    <Page size='A4' orientation="landscape" style={styles.page}>
      <View style={styles.header}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', lineHeight: '150%' }}>VAIDYANATHA MALARAYA SAPARIVARA DAIVASTHANA</Text>
        <Text style={{ fontSize: 14 }}>MALARAYA JERA, DHARMA NAGARA, KAMBALABETTU - 574243</Text>
        <Text style={{ fontSize: 13 }}>Mobile: +91 636041602,  eMail: malarayajera@gmail.com</Text>
        <Text style={{ fontSize: 18, fontWeight: 'bold', lineHeight: '150%', marginTop: 10, textDecoration: 'underline' }}>RECEIPT</Text>
      </View>
      <View style={[styles.section, { marginBottom: 5 }]}>
        <View style={[styles.section1, { width: '65%'}]}><Text style={{ color: 'gray'}}>Receipt No.:</Text><Text>200133</Text></View>
        <View style={[styles.section1, { width: '25%'}]}><Text style={{ color: 'gray'}}>Receipt Date :</Text><Text>01/10/2025</Text></View>
      </View>
      <View style={[styles.section, { marginBottom: 4 }]}>
        <View style={[styles.section1,{ width: '65%'}]}><Text style={{ color: 'gray'}}>Devotee Name : </Text><Text style={{color: 'black'}}>Surendra Suvarna</Text></View>
        <View style={[styles.section1, { width: '25%'}]}><Text style={{color: 'gray'}}>Mobile : </Text><Text>7795299112</Text></View>
      </View>
      <View style={{ display: 'flex', flexDirection:'row', margin: 10, padding:4, borderBottom: '1px solid black', borderTop: '1px solid black'}}>
        <View style={{ width:'10%'}}><Text>Sl.No.</Text></View>
        <View style={{ width:'35%'}}><Text>Seva Description</Text></View>
        <View style={{ width:'15%', alignItems:'center'}}><Text>Months</Text></View>
        <View style={{ width:'15%', alignItems:'flex-end'}}><Text>Seva Price</Text></View>
        <View style={{ width:'20%', alignItems:'flex-end'}}><Text>Total Amount</Text></View>
      </View>
      <View style={{ display: 'flex', flexDirection:'row', margin: 10, padding:4}}>
        <View style={{ width:'10%'}}><Text>1</Text></View>
        <View style={{ width:'35%'}}><Text>Bhoo Dhana Seva</Text></View>
        <View style={{ width:'15%', alignItems:'center'}}><Text>5</Text></View>
        <View style={{ width:'15%', alignItems:'flex-end'}}><Text>1000.00</Text></View>
        <View style={{ width:'20%', alignItems:'flex-end'}}><Text>5000.00</Text></View>
      </View>
      <View style={{display:'flex', flexDirection:'row', marginTop:10, padding:5, borderTop: '2px solid black'}}>
        <View style={{width:'60%', marginLeft: 10}}><Text style={{ color: 'gray', fontSize:12}}>Amount in Words:</Text><Text>{inWords(5010)}</Text></View>
        <View style={{width:'32%', alignItems:'flex-end'}}><Text style={{ fontSize:18, fontWeight:'bold'}}>TOTAL : 25,000.00</Text></View>
      </View>
      <View style={{display:'table', flexDirection:'row', width:'95%', padding: 10, justifyContent: "space-between" }}>
        <View><Text style={{fontSize:12}}>Payment Method: UPI</Text></View>
        <View><Text style={{fontSize:12}}>Trn.Ref.No.: 249343242432324</Text></View>
      </View> 
      <View style={styles.header}>
        <Text style={{fontSize:12, color:'gray'}}>This Receipt is printed electronically, so no signature is required. </Text>
      </View>
    </Page>
  </Document>
);

