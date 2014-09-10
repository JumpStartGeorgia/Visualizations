var holidays = [
   { country:{en:"Armenia",ka:"სომხეთი"}, national:12, y1:20, y5:0, y10:0, total:32},
   { country:{en:"Azerbaijan",ka:"აზერბაიჯანი"}, national:20, y1:15, y5:2, y10:2, total:39},
   { country:{en:"Belarus",ka:"ბელარუსი"}, national:9, y1:18, y5:0, y10:0, total:27},
   { country:{en:"Belgium",ka:"ბელგია"}, national:10, y1:20, y5:0, y10:0, total:30},
   { country:{en:"Brazil",ka:"ბრაზილია"}, national:10, y1:26, y5:0, y10:0, total:36},
   { country:{en:"Bulgaria ",ka:"ბულგარეთი"}, national:14, y1:20, y5:0, y10:0, total:34},
   { country:{en:"Canada",ka:"კანადა"}, national:10, y1:10, y5:0, y10:0, total:20},
   { country:{en:"China",ka:"ჩინეთი"}, national:11, y1:5, y5:0, y10:5, total:21},
   { country:{en:"Czech Republic",ka:"ჩეხეთი"}, national:12, y1:20, y5:0, y10:0, total:32},
   { country:{en:"France",ka:"საფრანგეთი"}, national:1, y1:30, y5:0, y10:0, total:31},
   { country:{en:"Georgia",ka:"საქართველო"}, national:15, y1:24, y5:0, y10:0, total:39},
   { country:{en:"Germany",ka:"გერმანია"}, national:10, y1:24, y5:0, y10:0, total:34},
   { country:{en:"Greece",ka:"საბერძნეთ"}, national:14, y1:20, y5:2, y10:3, total:39},
   { country:{en:"Hong Kong",ka:"ჰონგ კონგი"}, national:17, y1:7, y5:3, y10:4, total:31},
   { country:{en:"India",ka:"ინდოეთი"}, national:17, y1:15, y5:0, y10:0, total:32},
   { country:{en:"Italy",ka:"იტალია"}, national:13, y1:20, y5:0, y10:1, total:34},
   { country:{en:"Japan",ka:"იაპონია"}, national:0, y1:10, y5:6, y10:4, total:20},
   { country:{en:"Netherlands",ka:"ჰოლანდია"}, national:0, y1:20, y5:0, y10:0, total:20},
   { country:{en:"Poland",ka:"პოლონეთი"}, national:13, y1:20, y5:0, y10:6, total:39},
   { country:{en:"Romania",ka:"რუმინეთი"}, national:10, y1:20, y5:0, y10:0, total:30},
   { country:{en:"Russia",ka:"რუსეთი"}, national:11, y1:22, y5:0, y10:0, total:33},
   { country:{en:"South Korea ",ka:"სამხრეთ კორეა"}, national:15, y1:15, y5:2, y10:2, total:34},
   { country:{en:"Spain",ka:"ესპანეთი"}, national:12, y1:22, y5:0, y10:0, total:34},
   { country:{en:"Sweden",ka:"შვედეთი"}, national:0, y1:25, y5:0, y10:0, total:25},
   { country:{en:"Switzerland",ka:"შვეიცარია"}, national:0, y1:20, y5:0, y10:0, total:20},
   { country:{en:"Turkey",ka:"თურქეთი"}, national:8, y1:14, y5:0, y10:6, total:28},
   { country:{en:"UK",ka:"დიდი ბრიტანეთი"}, national:0, y1:28, y5:0, y10:0, total:28},
   { country:{en:"USA",ka:"აშშ"}, national:0, y1:0, y5:0, y10:0, total:0}
];
var legends = [
    { name:{en:"1 year of tenure",ka:"1-წლიანი მუშაობის შემდეგ"} },
    { name:{en:"5 years of tenure",ka:"5-წლიანი მუშაობის შემდეგ"} },
    { name:{en:"10 years of tenure",ka:"10-წლიანი მუშაობის შემდეგ"} },
    { name:{en:"National Holidays",ka:"ანაზღაურებადი უქმე დღეები"} }    
];
var comment = {
   en:
       "<div class='tip'>" + 
         "<div class='country'>&country</div>" + 
         "<div class='hl'></div>" + 
         "<div class='title'>PAID VACATION</div>" +
         "<div class='col'>"+ 
           "<div class='col1'>"+
             "<div class='t1'>Annual Leave</div>"+
             "<div class='t2'>National<br>Holidays</div>"+
           "</div>" +      
           "<div class='col2'>"+
             "<div class='t1'>For a worker with a tenure of</div>"+
             "<div class='t2'>"+
               "<div class='t21'><div>1</div><div>year</div></div>"+
               "<div class='t22'><div>5</div><div>years</div></div>" + 
               "<div class='t23'><div>10</div><div>years</div></div>" + 
             "</div>"+
             "<div class='t3'><div class='y1-value'>&y1</div><div class='y5-value'>&y5</div><div class='y10-value'>&y10</div></div>"+
             "<div class='t4'><div class='h-value'>&h</div></div>"+
           "</div>" +       
           "<div class='col3'><div class='t1'>TOTAL</div><div class='t2'>&t</div></div>"+
         "</div>" +  
       "</div>",
    ka:
        "<div class='tip'>" + 
         "<div class='country'>&country</div>" + 
         "<div class='hl'></div>" + 
         "<div class='title'>ანაზღაურებადი დასვენების დღეები</div>" +
         "<div class='col'>"+ 
           "<div class='col1'>"+
             "<div class='t1'>შვებულება</div>"+
             "<div class='t2'>უქმე დღეები</div>"+
           "</div>" +      
           "<div class='col2'>"+
             "<div class='t1'>მუშაობის დაწყებიდან</div>"+
             "<div class='t2'>"+
               "<div class='t21'><div>1 წლის</div><div>შემდეგ</div></div>"+
               "<div class='t22'><div>5 წლის</div><div>შემდეგ</div></div>" + 
               "<div class='t23'><div>10 წლის</div><div>შემდეგ</div></div>" + 
             "</div>"+
             "<div class='t3'><div class='y1-value'>&y1</div><div class='y5-value'>&y5</div><div class='y10-value'>&y10</div></div>"+
             "<div class='t4'><div class='h-value'>&h</div></div>"+
           "</div>" +       
           "<div class='col3'><div class='t1'>სულ</div><div class='t2'>&t</div></div>"+
         "</div>" +  
       "</div>"
};
 var labels = {
   legend_title:{"en":"Paid annual leave&n(in working days) for a worker with",
   "ka":"ანაზღაურებადი შვებულება&n(სამუშაო დღეები)"},
   legend_comment1:{"en":" Only a few Labour Codes&ndifferentiate the length of&nannual leave based on&nthe length of employment",
                    "ka":"ზოგიერთი ქვეყნის კანონმდებლობა&nშვებულების დღეების რაოდენობას&nმუშაობის ხანგრძლივობის&nმიხედვით განსაზღვრავს."},
   legend_comment2:{"en":"Easter Sunday is not included&nin the Public Holidays.",
                     "ka":"აღდგომის კვირა დღე არ არის&nგათვალისწინებული უქმე დღეებში."}
 };