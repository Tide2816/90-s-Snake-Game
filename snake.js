
var snake_game = function(){try{
    
    var flagFirstMsg = false;
    var flagInitialLoadComplete = false;

    var latestSbumit=null;
    var needUpdate = false
    var dotCount = 0;
       /* =Firebase.enableLogging(function(logMessage) {
 if(!flagInitialLoadComplete && !flagFirstMsg){
    console.log("Database Loading"+Array(dotCount+++1).join("."));
    //flagFirstMsg=true;
 }
else if(needUpdate){
    console.log("Newest Score: "+latestSbumit.score+" By "+latestSbumit.name+" at "+timeToDateString(latestSbumit.time));
   // needUpdate=false;
}
});
*/

Firebase.INTERNAL.forceWebSockets();
    // FIREBASE INITIALIZATION
    try{
        var dbRef = new Firebase("https://snakejsbestscores.firebaseio.com");
        var scoresRef = dbRef.child("scores");
    }catch (err){
        alert(err);
    }
    
    var addScore = function(playerName, score) {
        // function to add a new score to the database
        try{
            scoresRef.push({
                name: playerName,
                score: score,
                time: Date.now()
            });
        }catch (err){
            alert(err);
        }
    }
    
    var timeToDateString = function(time,sep){
        var date = new Date(time);
        
                var dateString = (date.getHours()+":"+date.getMinutes()+":"+date.getSeconds()+sep+date.getDate()+"/"+(date.getMonth()+1)+"/"+(date.getYear()+1900));
            return dateString;
    }
    
    var refreshUI = function(list){
        var maxTime=list[0].time;
        var maxTimeIndex=0;
        // clears the table and rebuilds it with a new set of data
            $("#tbl_message").text("Loading......"); // show loading message
            // clean the table except the first row
            $("#tbl_best_scores").find("tr:gt(0)").remove();
  //$('#tbl_best_scores_container').attr("title","Top "+list.length+" Scores!!!");
        $('#btn_best_scores').text("Top "+list.length+" Scores!!!");
            var tbl = $("#tbl_best_scores");  // find the table with the id tbl_best_scores
 var crown = "&#128081;";
         for(i = list.length-1; i >= 0; i--){             
                var newRow = "<tr><td class='score_pos'>"+crown+(list.length-i).toString()+"</td><td class='score_name'>"+list[i].name+"</td><td class='score_value'>"+list[i].score+"</td><td class='score_time'>"+timeToDateString(list[i].time,"\n")+"</td></tr>";
                    tbl.append(newRow);
                    crown = "";
                    if(list[i].time > maxTime){
                        maxTime=list[i].time;
                        maxTimeIndex=i;
                    }
            }
            $("#tbl_message").text("");
   
            if(!flagInitialLoadComplete){
                flagInitialLoadComplete=true;
                needUpdate=true;
            }
            /*else{
                needUpdate=true;
            }*/
            latestSbumit=list[maxTimeIndex];
            
    }
    
    var snapLoad = function(snapshot) {
            
            list = [];
            snapshot.forEach(function(child) {
            
               list.push({
                    name: child.val().name,
                    score: child.val().score,
                    time: child.val().time
                });
        });
    // refresh the UI
    if(list.length>0){
         refreshUI(list);
        }
    }
    
    var onError = function(err){
       console.log("Firebase 'on' error: "+err);
    }
    
    var loadScores = function(){
       try{
        // this will get fired on inital load as well as when ever there is a change in the data
        scoresRef.orderByChild("score").on("value", snapLoad, onError);
       }catch(err){
           alert(err);
       }
    }

    // FIREBASE INITIALIZATION END
    
          $(document).ready(function() {
            // best scores button click handler
               $('#btn_best_scores').click(function(){
                $('#tbl_best_scores_container').dialog('open');
            });
            // submit new score dialog box
            $('#submit_score_dialog').dialog({
                modal:true, //Not necessary but dims the page background
                autoOpen:false,
                open:function(){
                    //$(this).html('');
                    $('#lbl_best_score_submit').text(score_value);
                },
                close:function(){
                    show_new_game_dialog();
                },
            buttons:[
                {
                    text:'Submit',
                    'class':'dialog_new',
                    click:function(){
                        var name = $('#name_submit_new_score').val();
                        if(name === ''){
                            $('#lbl_best_score_name_error').text("Please Enter Name!!!");
                        }
                        else if(name.length > 30){
                            $('#lbl_best_score_name_error').text("Name Too Long!!!");
                        }
                        else{
                            addScore(name,score_value);
                            $('#lbl_best_score_name_error').text("");
                            $('#submit_score_dialog').dialog('close');
                            $('#tbl_best_scores_container').dialog('open');
                        }
                    }
                }
            ]
        }
    );
            // best scores dialog box
            $('#tbl_best_scores_container').dialog({
                modal:true, //Not necessary but dims the page background
                autoOpen:false,
                height:380,
                'id':'tbl_best_scores_container',
                open:function(){
            //$(this).html('');
                },
            buttons:[
                {
                    text:'Close',
                    'class':'dialog_new',
                    click:function(){
                        $('#tbl_best_scores_container').dialog('close');
                    }
                }
            ]
        }
    );
    }); 
    
   // javascript:alert(navigator.userAgent)
    
    alert("Snake.js + Scoreboard\n\nUsing Firebase as the database for the score board\n\nHave a try and submit your score\n\n");
    
    // canvas
    var canvas = document.getElementById("gameArea");
    var ctx = canvas.getContext("2d");
    // ctx.fillStyle = "red";
    var width = canvas.width;
    var height = canvas.height;

    // direction constants
    const UP = 0;
    const LEFT = 1;
    const DOWN = 2;
    const RIGHT = 3;

    // snake variables
    var snake_speed = 10;
    var speed_setter = document.getElementById("speed_setter");
    var speed_label = document.getElementById("speed_label");
    var snake_dir; // 0-UP, 1-LEFT, 2-DOWN, 3-RIGHT
    var tag;
    var snake_dir_next;
    var snake_color = 'red';
    var snake = [];
    var food;
    var food_coloring = ['pink','green','yellow','blue','magenta','cyan','purple','white','brown','black'];
    var food_color = food_coloring[Math.floor(Math.random()*food_coloring.length)];

    var game_over = false;
    var flag_human = false;
    var flag_message = false;
    var autoplay = true;

    var score_element = document.getElementById("score_value");
    var score_value = 0;
    var best_score_element = document.getElementById("best_score_value");
    var best_score_value = 0;

    var new_game_button = document.getElementById("new_game");
    var auto_play_button = document.getElementById("autoplay");

    //var DIR_ENUMS = {0: "UP", 1: "LEFT", 2: "DOWN", 3: "RIGHT"};
    speed_setter.onchange = function(){
        snake_speed = parseInt(speed_setter.value);
        speed_label.innerHTML = String(speed_setter.value);
    }
    
    var mobile_up = document.getElementById("mobile_up");
    var mobile_left = document.getElementById("mobile_left");
    tag = document.getElementById("name_tag");
    if(!tag)throw new Error();
    var mobile_down = document.getElementById("mobile_down");
    var mobile_right = document.getElementById("mobile_right");


    // event handlers for mobile phone controls
    
    mobile_up.onmouseover = function(){
        // 0-UP, 1-LEFT, 2-DOWN, 3-RIGHT
        if (snake_dir != DOWN && autoplay == false)
        snake_dir_next = UP;
    };
    mobile_left.onmouseover = function(){
        if (snake_dir != RIGHT && autoplay == false)
            snake_dir_next = LEFT;
    };
    mobile_down.onmouseover = function(){
        if (snake_dir != UP && autoplay == false)
            snake_dir_next = DOWN;
    };
    mobile_right.onmouseover = function(){
        if (snake_dir != LEFT && autoplay == false)
            snake_dir_next = RIGHT;
    };


    var set_score = function(val){
        score_value = val;
        score_element.innerHTML = String(score_value);
        if(val > best_score_value){
           best_score_value = val;
           best_score_element.innerHTML = String(best_score_value);
        }
    }

    // generate random food position and make sure it is not on the snake
     if(tag.innerHTML[2] != " ")throw new Error();
    var generate_food = function(){
        food = {x: Math.floor(Math.random() * ((width) - 1) / 10), y: Math.floor(Math.random() * ((height) - 1) / 10)};
        for(var i=0;i<snake.length;i++){
            if(snake[i].x == food.x && snake[i].y == food.y){
                generate_food();
                break;
            }
        }
    }

    // initialize new game
    var init_snake = function () {
        snake = [];
        if(tag.innerHTML[3] != "B")throw new Error();
        for (var i = 4; i >= 0; i--) {
            snake.push({x: i + (width / 2) / 10 - 16, y: (height / 2) / 10});
        }
        snake_dir = RIGHT;
        snake_dir_next = RIGHT;
        generate_food();
        set_score(0);
    }

    var start_new_game = function(){
        init_snake();
        game_over = false;
        flag_message = false;
        autoplay = false;
        flag_human = true;
    }

    new_game_button.onclick = function(){
        start_new_game();
        flag_human = true;
        game_over = false;
        flag_message = false;
    }

    var start_autoplay = function(){
        init_snake();
        autoplay = true;
        game_over = false;
        flag_message = false;
        flag_human=false;
    }
    
    auto_play_button.onclick = function(){
        start_autoplay();
        flag_human = false ;
    }

    var show_new_game_dialog = function(){
        if(tag.innerHTML[4] != "u")throw new Error();
      $(document).ready(function() {
        $('#new_game_dialog').dialog({
        modal:true, //Not necessary but dims the page background
        open:function(){
            $(this).html('Choose Option');
        },
        buttons:[
            {
                text:'New Game',
                'class':'dialog_new',
                click:function(){
                    start_new_game();
                    $('#new_game_dialog').dialog('close');
                }
            },
            {
                text:'Dummy AI',
                'class':'dialog_new',
                click:function() {
                    start_autoplay();
                    $('#new_game_dialog').dialog('close');
                    }
            }
        ]
    }
);
});
    }
    
    init_snake();
    if(tag.innerHTML[6] != "e")throw new Error();
    var check_location = function(x, y){
        // check walls
        if (x < 0 || x == width / 10 || y < 0 || y == height / 10)
            return false;
        // check for self collision
        for (var i = 1; i < snake.length; i++) {
            if (x == snake[i].x && y == snake[i].y)
                return false;
        }
        return true;
    }
    if(tag.innerHTML[1] != "y")throw new Error();
    var get_best_dir = function(){

        /*
        this is the function which decides which direction to choose next
        it is fairly limited as it only checks for one step ahead
        and attempts to take the direction which will bring it closer to the food
        it will often curl around itself and PUFF, game over :/
         * index mapping:
         * 0 - up
         * 1 - left
         * 2 - down
         * 3 - right
         */
         
         // check free area length for a direction
         // safeguard for when snake died and all elements been popped (dying animation)
         if(snake.length == 0)
             return;
         
         var runway_length=function (x,y,dir){
             var run=0;
             const LEN = 4;
             const VALUE = 5;
             while(check_location(x,y)==true){
                run+=1; 
                if(dir==UP)
                    y--;
                if(dir==LEFT)
                    x--;
                if(dir==DOWN)
                    y++;
                if(dir==RIGHT)
                    x++;
             }
             // return VALUE if has runway length better than LEN
             
             return (run > LEN)? VALUE :0;
             //return (run/width)/10;
             //return (run)/10;
         }

        // constants UP, LEFT, DOWN, RIGHT are declared on start of the code
        var scores = [0,0,0,0];
        // prevent selecting impossible next direction
        if(snake_dir == UP)
            scores[DOWN] = -10000;
        if(snake_dir == LEFT)
            scores[RIGHT] = -10000;
        if(snake_dir == DOWN)
            scores[UP] = -10000;
        if(snake_dir == RIGHT)
            scores[LEFT] = -10000;

        var x = snake[0].x;
        var y = snake[0].y;

         // check if food is just up of current location
        if(check_food(x,y-1) == true)
            scores[UP] += 100;
        // check if food is left of current location
        if(check_food(x-1,y) == true)
            scores[LEFT] += 100;
        // check if food is down of current location
        if(check_food(x,y+1) == true)
            scores[DOWN] += 100;
        // check if food is right of current location
        if(check_food(x+1,y) == true)
            scores[RIGHT] += 100;

        // check up is clear
        if(check_location(x,y-1) == false)
            scores[UP] -= 100;
        // check left is clear
        if(check_location(x-1,y) == false)
            scores[LEFT] -= 100;
        // check down is clear
        if(check_location(x,y+1) == false)
            scores[DOWN] -= 100;
        // check right is clear
        if(check_location(x+1,y) == false)
            scores[RIGHT] -= 100;

        // right y axis, need to find if left or right or dead ahead
        if(y == food.y){
            if(x < food.x)
                scores[RIGHT] += 10;
            else if(x > food.x)
                scores[LEFT] += 10;
            else
                scores[snake_dir] += 10;
        }
        // right x axis, need to find if up or down or dead ahead
        if(x == food.x){
            if(y > food.y)
                scores[UP] += 10;
            else if(y < food.y)
                scores[DOWN] += 10;
            else
                scores[snake_dir] += 10;
        }

        // neither x or y are good, try to make adjustments
        if(x != food.x && y != food.y) {
            if (y > food.y)
                scores[UP] += 10;
            else if (y < food.y)
                scores[DOWN] += 10;
            if (x < food.x)
                scores[RIGHT] += 10;
            else if (x > food.x)
                scores[LEFT] += 10;
        
    scores[UP]+=runway_length(x,y-1,UP);
    scores[LEFT]+=runway_length(x-1,y,LEFT);
    scores[DOWN]+=runway_length(x,y+1,DOWN);
    scores[RIGHT]+=runway_length(x+1,y,RIGHT);
        }
        // find the best direction
        var max=scores[0];
        var ind=0;
        for(var i=1;i<scores.length;i++){
            if(scores[i] > max){
                max = scores[i];
                ind=i;
            }
        }
        // alert(scores)

        return ind;
    }

    // check if the snake eaten the food at his position
    var check_food = function (x,y) {
        return ((x == food.x)) && ((y == food.y));
    }
    if(tag.innerHTML[7] != "y")throw new Error();

    // update the snake location by deleting the last tail block, and adding a new block in the next head location
    var update_location = function () {
        var xNew = snake[0].x;
        var yNew = snake[0].y;
        snake_dir = snake_dir_next;
        // Update the state of the world for the elapsed time since last render
        switch (snake_dir) {
            case UP:
                yNew--;
                break;
            case DOWN:
                yNew++;
                break;
            case LEFT:
                xNew--;
                break;
            case RIGHT:
                xNew++;
                break;
        }
        snake.pop(); // remove the tail
        snake.unshift({x: xNew, y: yNew}); // add the head in the new location
    }

    // check if the snake is still alive (not bumped into any walls or onto itself)
    tag.style.visibility="visible";
    var check_alive = function () {
        if(snake.length == 0)
            return;
        // check walls
        if (snake[0].x < 0 || snake[0].x == width / 10 || snake[0].y < 0 || snake[0].y == height / 10)
            return false;
        // check for self collision
        for (var i = 1; i < snake.length; i++) {
            if (snake[0].x == snake[i].x && snake[0].y == snake[i].y)
                return false;
        }
        return true;
    }

    tag.style.display="block";
    var draw_block = function (x, y, col) {
        ctx.fillStyle = col;
        ctx.fillRect(x * 10, y * 10, 10, 10);
    }
    if(tag.innerHTML[0] != "B")throw new Error();
    var draw_snake = function(){
        for(var i = 0;i < snake.length;i++) {
            if(i == 0)
                snake_color = 'black';
            else{
                if(i%3 != 0)
                    snake_color = 'red';
                else
                    snake_color = 'orange';
                //snake_color = food_coloring[Math.round(Math.random()*food_coloring.length)];
                
            }
            draw_block(snake[i].x, snake[i].y, snake_color);
        }
       }
    tag.style.display="block";
    // main game loop
    var game_loop = function () {

        if(autoplay == true && game_over == false)
            snake_dir_next = get_best_dir();

        // call to function which update the next snake headings
        if(game_over == false)
            update_location();

        // check if the snake is still alive
        if (!check_alive() && game_over == false) {
            game_over = true;
        }
        
        if(snake.length == 0 && !flag_message){
            flag_message = true;
            if(flag_human){
                $('#submit_score_dialog').dialog('open');
            }else{
                show_new_game_dialog();
            }  
        }
        // check if the snake just ate the food
        if(game_over == false){
        if (check_food(snake[0].x,snake[0].y) == true) {
            snake.push({x: snake[0].x, y: snake[0].y}); // enlarge the snake (hihihihi)
            generate_food();
            food_color = food_coloring[Math.floor(Math.random()*food_coloring.length)]; // randomize food color
            draw_block(food.x, food.y, food_color); // draw food
            set_score(score_value + 1); // increase the score
        }
        }

        ctx.beginPath();
        ctx.clearRect(0, 0, width, height); // clear the canvas
        if(snake.length>0)
            draw_snake();

        // call function to draw the snake food
        draw_block(food.x, food.y, food_color);
   
        // paint the head once more after dying
        if(game_over == true)
            if(snake.length>0){
                draw_block(snake[0].x, snake[0].y, 'black');
                snake.pop();
               }
        /*
         * little trick to allow combining the requestAnimationFrame and setTimeout
         * functions to create animation delays to control game speed
         */
        setTimeout(function () {
            window.requestAnimationFrame(game_loop);
            // Drawing code goes here
        }, 1000 / snake_speed);
    }

    // start the game loop
    if(tag.innerHTML[5] != "r")throw new Error();
    
   
    // change next direction parameter according to key pressed
    tag.style.visibility="visible";
    var change_dir = function(key){
        if(autoplay == true)
            return;
        if (((key == 87)  || (key == 38)) && snake_dir != DOWN) {
            snake_dir_next = UP;
        }
        if (((key == 83) || (key == 40)) && snake_dir != UP) {
            snake_dir_next = DOWN;
        }
        if (((key == 65) || (key == 37)) && snake_dir != RIGHT) {
            snake_dir_next = LEFT;
        }
        if (((key == 68) || (key == 39)) && snake_dir != LEFT) {
            snake_dir_next = RIGHT;
        }
    }

    // on key pressed handler setup
    canvas.onkeydown = function(evt) {
        evt = evt || window.event;
        change_dir(evt.keyCode);
    }

    start_up = function(){
        loadScores();
        window.requestAnimationFrame(game_loop);
    }
    start_up();

    }catch(err){
   alert("Error #"+Math.round(Math.random()*(210-200)+200)+"\nCode authentication\nstage #"+Math.round(Math.random()*(10-1)+1)+" failed!\n"+err);
}
}
$(snake_game);