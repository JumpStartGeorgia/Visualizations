var locale = 'ka';

function create_chart_axis(axis){
console.log('create chart axis start');
  x = [];

  for (var i = 0; i<axis.length; i++){
    console.log("axis[i] = " + axis[i]);
    x[i] = translations[locale]['categories'][axis[i]];
  }

console.log('create chart axis stop');
  return x;
}

var chart_data = {
  trust: {
    axis: ["rel", "army", "police", "ex_gov", "ed", "parl", "eu", "un", "health", "banks", "omb", "local_gov", "pres", "ngo", "media", "courts", "pol_parties"],
    values: [85,68,50,48,44,43,41,40,39,37,32,28,28,25,22,19,16]
  },
  distrust: {
    axis: ["pres", "courts", "banks", "local_gov", "pol_parties", "health", "media", "police", "ed", "ngo", "parl", "ex_gov", "un", "eu", "army", "omb", "rel"],
    values: [31,26,20,18,17,17,14,11,10,9,8,7,6,6,4,4,2]
  },
  partial: {
    axis: ["media", "pol_parties", "local_gov", "health", "ngo", "parl", "pres", "police", "ed", "un", "banks", "eu", "omb", "courts", "ex_gov", "army", "rel"],
    values: [51,44,40,38,33,31,31,31,31,29,28,28,28,28,27,18,9]
  },
  not_know: {
    axis: ["omb", "ngo", "courts", "un", "eu", "pol_parties", "ex_gov", "parl", "ed", "banks", "local_gov", "media", "army", "pres", "police", "health", "rel"],
    values: [35,33,27,25,25,23,18,17,16,15,14,13,10,9,8,6,5]
  }
};

var translations = {
  en: {
    categories:{
      army: "Army",
      banks: "Banks",
      courts: "Court System",
      ed: "Educational System",
      eu: "European Union",
      ex_gov: "Executive Government",
      health: "Healthcare System",
      local_gov: "Local Government",
      media: "Media",
      ngo: "NGOs",
      omb: "Ombudsman",
      parl: "Parliament",
      police: "Police",
      pol_parties: "Political Parties",
      pres: "President",
      rel: "Religious Institutions",
      un: "United Nation"
    },
    groups:{
      trust: "Trust",
      distrust: "Distrust",
      partial: "Partialy Both",
      not_know: "Don't Know"
    }
  },
  ka: {
    categories:{
      army: "ჯარი",
      banks: "ბანკები",
      courts: "სასამართლო სისტემა",
      ed: "საგანმანათლებლო სისტემა",
      eu: "ევროკავშირი",
      ex_gov: "აღმასრულებელი ხელისუფლება",
      health: "ჯანდაცვის სისტემა",
      local_gov: "ადგილობრივი ხელისუფლება",
      media: "მასმედია",
      ngo: "არასამთავრობო ორგანიზაციები",
      omb: "სახალხო დამცველი",
      parl: "პარლამენტი",
      police: "პოლიცია",
      pol_parties: "პარტიები",
      pres: "პრეზიდენტი",
      rel: "რელიგიური ინსტიტუტები",
      un: "გაერო"
    },
    groups:{
      trust: "ვენდობი",
      distrust: "არ ვენდობი",
      partial: "ნაწილობრივ ორივე",
      not_know: "არ ვიცი"
    }
  }
};
