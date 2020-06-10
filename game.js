//Set up basic game with Phaser

let config = {
    width : 800,
    height : 600,
    scene : {
        preload : preload,
        create : create,
        update : update,
        
    }
};
let game = new Phaser.Game(config);
let prizeNo=12;
let prizes=['CB Book','3000 CB Credits','35% Off','Hard Luck','70% Off','CB Swagpack','100% Off','Netflix Subscription','50% Off','Amazon Voucher','2 Extra Spin','CB T-Shirt'];
let spins=3;    

function preload(){
    //load an image
    console.log(this);
    this.load.image('background',"Assets/background.jpg");
    this.load.image('wheel',"Assets/wheel.png");
    this.load.image('stand',"Assets/stand.png");
    this.load.image('pin',"Assets/pin.png");
    this.load.image('logo',"Assets/spin-n-win-logo.png");
    this.load.image('spin-button',"Assets/spin-button.png");
    this.load.audio('wheel-spin',"Assets/wheel-sound.mp3");
    this.load.image('winMsg',"Assets/win.jpg");
    this.load.image('loseMsg',"Assets/sad-face.png");
    
}
function create(){
    //create that image
    let W = game.config.width;
    let H = game.config.height;
    
    //adding background
    this.bg= this.add.sprite(640,320,'background');    
    
    //adding pin
    let pin = this.add.sprite(W/2+200,H/2-250,'pin').setScale(0.15);
    pin.depth = 5;
    
    //adding stand
    this.add.sprite(W/2+200,H/2 + 70,'stand').setScale(0.15);
    
    
    //adding wheel
    this.wheel = this.add.sprite(W/2+200,H/2-100,"wheel");
    this.wheel.setScale(0.15); 
    let graphics= this.add.graphics({
        x: W/2+125,
        y: H/2-130
    })
    .fillStyle(0xffff00, 0.5)
    .fillEllipse(W/2+100, H/2-100,this.wheel.width,this.wheel.height,32).setScale(0.15);
    
    this.tweens.add({
        targets: graphics,
        alpha: 0.25,
        ease: 'Cubic.easeOut',  
        duration: 1000,
        repeat: -1,
        yoyo: true
      })
    
    
    //adding spin and win logo
    this.add.sprite(200,50,'logo').setScale(0.15);
    
    //adding text
    let text ="This Summer, Spin the wheel with us and \n get assured prizes to spring up the learning spree";
    
    text = this.add.text(60, 130, text,{ font:"15px Roboto",fill: '#EB2B40',align: 'center'});
    
    //prize text
    this.prizeText=this.add.text(W/2-50,H/2-50,"",{ font:"12px Roboto",fill: 'black'});
    //this.prizeText.align = "center";
    this.prizeText.depth= 5;
    
    //lose message
    this.loseText=this.add.text(W/2-50,H/2-50,"",{ font:"12px Roboto",fill: 'black'});
    this.loseText.align = "center";
    this.loseText.depth= 5;
    
    this.gift=this.add.sprite(W/2,H/2-100,'winMsg').setScale(0.3);
    this.gift.depth=2;
    this.gift.alpha=0;
    
    
    this.hardluck=this.add.sprite(W/2,H/2-100,'loseMsg').setScale(0.5);
    this.hardluck.depth=2;
    this.hardluck.alpha=0;
    
    this.canSpin=true;
    
    //audio for wheel spin
    wheelSound= this.sound.add('wheel-spin');
    
    this.spinsleft=this.add.text(W/2-260,H/2-100,`${spins} SPINS LEFT`,{ font:"20px Roboto",fill: 'red'});
       
    //adding spin button
    this.spinButton = this.add.sprite(W/2-200,H/2, 'spin-button').setScale(0.3).setInteractive({cursor:'pointer'});
    this.spinButton.on("pointerdown",spinwheel,this);
  
}
function update(){
    //console.log("In Update");
    //this.wheel.angle -= 1;
    
}

function spinwheel(){
    if(spins > 0){
        let win=true;
        this.gift.alpha=0;
        this.hardluck.alpha=0;
        let rounds = Phaser.Math.Between(3,5);
        let extra_degrees = Phaser.Math.Between(0,11)*30;
        let total_angle = rounds*360 + extra_degrees;
        let winningPrize = prizeNo-Math.floor(extra_degrees/30);
   
        console.log(winningPrize);
        if(winningPrize==3)
        {   win=false;}
    
        else if(winningPrize==10){
            spins = spins + 2;
        }
        if(this.canSpin){
            this.prizeText.setText("");
            this.loseText.setText("");
            wheelSound.play();
            this.canSpin=false;
        }
    
        let tween = this.tweens.add({
            targets: this.wheel,
            angle: total_angle,
            ease:"Cubic.easeOut",
            duration: 7000,
            callbackScope: this,
            onComplete: function(tween){
                if(win){
                    this.gift.alpha=1;
                    this.prizeText.setText(`Congratulations!! You got ${prizes[winningPrize]}`);    
                }
                else{
                    this.hardluck.alpha=1;
                    this.loseText.setText("Better Luck Next Time!");
                }
                this.input.on("pointerdown",restart,this);            
                this.canSpin=true;
                spins--;
            }
        
        });  
    
    }
    
}

function restart(){
   this.scene.restart();
    
}
                        
