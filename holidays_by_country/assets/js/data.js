var holidays = [
   { country:{en:"Armenia",ge:"სომხეთი"}, national:12, y1:20, y5:0, y10:0, total:32},
   { country:{en:"Azerbaijan",ge:"აზერბაიჯანი"}, national:20, y1:15, y5:2, y10:2, total:39},
   { country:{en:"Belarus",ge:"ბელარუსი"}, national:9, y1:18, y5:0, y10:0, total:27},
   { country:{en:"Belgium",ge:"ბელგია"}, national:10, y1:20, y5:0, y10:0, total:30},
   { country:{en:"Brazil",ge:"ბრაზილია"}, national:10, y1:26, y5:0, y10:0, total:36},
   { country:{en:"Bulgaria ",ge:"ბულგარეთი"}, national:14, y1:20, y5:0, y10:0, total:34},
   { country:{en:"Canada",ge:"კანადა"}, national:10, y1:10, y5:0, y10:0, total:20},
   { country:{en:"China",ge:"ჩინეთი"}, national:11, y1:5, y5:0, y10:5, total:21},
   { country:{en:"Czech Republic",ge:"ჩეხეთი"}, national:12, y1:20, y5:0, y10:0, total:32},
   { country:{en:"France",ge:"საფრანგეთი"}, national:1, y1:30, y5:0, y10:0, total:31},
   { country:{en:"Georgia",ge:"საქართველო"}, national:15, y1:24, y5:0, y10:0, total:39},
   { country:{en:"Germany",ge:"გერმანია"}, national:10, y1:24, y5:0, y10:0, total:34},
   { country:{en:"Greece",ge:"საბერძნეთ"}, national:14, y1:20, y5:2, y10:3, total:39},
   { country:{en:"Hong Kong",ge:"ჰონგ კონგი"}, national:17, y1:7, y5:3, y10:4, total:31},
   { country:{en:"India",ge:"ინდოეთი"}, national:17, y1:15, y5:0, y10:0, total:32},
   { country:{en:"Italy",ge:"იტალია"}, national:13, y1:20, y5:0, y10:1, total:34},
   { country:{en:"Japan",ge:"იაპონია"}, national:0, y1:10, y5:6, y10:4, total:20},
   { country:{en:"Netherlands",ge:"ჰოლანდია"}, national:0, y1:20, y5:0, y10:0, total:20},
   { country:{en:"Poland",ge:"პოლონეთი"}, national:13, y1:20, y5:0, y10:6, total:39},
   { country:{en:"Romania",ge:"რუმინეთი"}, national:10, y1:20, y5:0, y10:0, total:30},
   { country:{en:"Russia",ge:"რუსეთი"}, national:11, y1:22, y5:0, y10:0, total:33},
   { country:{en:"South Korea ",ge:"სამხრეთ კორეა"}, national:15, y1:15, y5:2, y10:2, total:34},
   { country:{en:"Spain",ge:"ესპანეთი"}, national:12, y1:22, y5:0, y10:0, total:34},
   { country:{en:"Sweden",ge:"შვედეთი"}, national:0, y1:25, y5:0, y10:0, total:25},
   { country:{en:"Switzerland",ge:"შვეიცარია"}, national:0, y1:20, y5:0, y10:0, total:20},
   { country:{en:"Turkey",ge:"თურქეთი"}, national:8, y1:14, y5:0, y10:6, total:28},
   { country:{en:"UK",ge:"დიდი ბრიტანეთი"}, national:0, y1:28, y5:0, y10:0, total:28},
   { country:{en:"USA",ge:"აშშ"}, national:0, y1:0, y5:0, y10:0, total:0}
];

var legends = [
    { name:{en:"1 year of tenure",ka:"1-წლიანი მუშაობის შემდეგ"} },
    { name:{en:"5 years of tenure",ka:"5-წლიანი მუშაობის შემდეგ"} },
    { name:{en:"10 years of tenure",ka:"10-წლიანი მუშაობის შემდეგ"} },
    { name:{en:"National Holidays",ka:"ანაზღაურებადი უქმე დღეები"} }    
];
var tips = {
   country:{en:"Country",ka:"ქვეყანა"},
   category:{en:"Category [ Annual(Min)/Annual(Max)/National ]:",ka:"დასვენების დღეები [ შვებულება (მინ.)/შვებულება (მაქს.)/უქმე დღეები ]:"},
   total:{en:"Total",ka:"სულ"},
   comment:{en:"Comment",ka:"კომენტარი"},
};