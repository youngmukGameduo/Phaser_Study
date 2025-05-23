import Phaser from "phaser";
import { setBackground } from "../utils/backgrundManager";
import { setAttackScale,setAttackDamage,addAttackEvent, removeAttack } from "../utils/attackManager";
import { pause } from "../utils/pauseManager";
import Config from "../Config";
import Player from "../characters/Player";
import Mob from "../characters/Mob";
import ExpBar from "../ui/ExpBar";
import TopBar from "../ui/TopBar";
import { addMob, addMobEvent, removeOidestMobEvent } from "../utils/mobManager";
import { createTime } from "../utils/time";

export default class PlayingScene extends Phaser.Scene
{
    constructor()
    {
        super("playGame");
    }

    create()
    {
        this.sound.pauseOnBlur = false;
        this.m_beamSound = this.sound.add("audio_beam");
        this.m_scratchSound = this.sound.add("audio_scratch");
        this.m_hitMobSound = this.sound.add("audio_hitMob");
        this.m_growlSound = this.sound.add("audio_growl");
        this.m_explosionSound = this.sound.add("audio_explosion");
        this.m_expUpSound = this.sound.add("audio_expUp");
        this.m_hurtSound = this.sound.add("audio_hurt");
        this.m_nextLevelSound = this.sound.add("audio_nextLevel");
        this.m_gameOverSound = this.sound.add("audio_gameOver");
        this.m_gameClearSound = this.sound.add("audio_gameClear");
        this.m_pauseInSound = this.sound.add("audio_pauseIn");
        this.m_pauseOutSound = this.sound.add("audio_pauseOut");

        this.m_player = new Player(this);
        this.m_cursorKeys = this.input.keyboard.createCursorKeys();
        this.m_mobs = this.physics.add.group();
        this.m_mobEvents = [];
        this.m_weaponDynamic = this.add.group();
        this.m_weaponStatic = this.add.group();
        this.m_attackEvents = {};
        this.m_expUps = this.physics.add.group();
        
        this.m_topBar = new TopBar(this);
        this.m_expBar = new ExpBar(this);

        this.m_mobs.add(new Mob(this, 0, 0, "mob1","mob1_anim", 10));   
        this.cameras.main.startFollow(this.m_player);
        
        addMobEvent(this, 1000, "mob1", "mob1_anim",10,0.9,50);
        addAttackEvent(this, "claw", 10, 2.3, 1500);
        setBackground(this, "background1");
        createTime(this);
        this.updatePlayerUI();

        
        //플레이어와 몬스터의 충돌 이벤트
        this.physics.add.overlap(
            this.m_player,
            this.m_mobs,
            ()=>this.m_player.hitByMob(10),
            null,
            this
        );

        //공격에 몬스터가 닿았을경우 처리
        this.physics.add.overlap(
            this.m_weaponDynamic,
            this.m_mobs,
            (weapon, mob) => mob.hitByDynamic(weapon, weapon.m_damage),
            null,
            this
        );
        this.physics.add.overlap(
            this.m_weaponStatic,
            this.m_mobs,
            (weapon, mob) => mob.hitByStatic(weapon.m_damage),
            null,
            this
        );

        //유저와 경험치가 닿았을경우 처리
        this.physics.add.overlap(
            this.m_player,
            this.m_expUps,
            (player, expItem) => this.pickExpUp(expItem),
            null,
            this
        );

        //ESC 키를 누르면 일시정지
        this.input.keyboard.on("keydown-ESC",()=>
            {
                pause(this, "pause");
            }, this);
    }

    update()
    {
        this.movePlayerManager();

        this.m_background.setX(this.m_player.x - Config.width / 2);
        this.m_background.setY(this.m_player.y - Config.height / 2);

        this.m_background.tilePositionX = this.m_player.x - Config.width / 2;
        this.m_background.tilePositionY = this.m_player.y - Config.height / 2;

        const closest = this.physics.closest(
            this.m_player,
            this.m_mobs.getChildren()
        );
        this.m_closest = closest;
    }

    pickExpUp(expItem)
    {
        expItem.disableBody(true,true);    
        this.m_expUps.remove(expItem, true, true);
        this.m_expUpSound.play();

        var nowLv = this.m_player.m_level;
        this.m_player.getExp(expItem.m_exp);
        var nextLv = this.m_player.m_level;
        this.updatePlayerUI();
        if(nowLv < nextLv)
        {
            pause(this,"levelup");
        }
    }

    afterLevelUp()
    {
        //레벨후처리
        switch(this.m_player.m_level)
        {
            case 2:
                {
                    removeOidestMobEvent(this);
                    addMobEvent(this, 1000, "mob2", "mob2_anim", 20, 0.8,50);
                    setAttackScale(this,"claw", 4);
                }
                break;
            case 3:
                {
                    removeOidestMobEvent(this);
                    addMobEvent(this, 1000, "mob3", "mob3_anim", 30, 0.8,50);
                    addAttackEvent(this,"catnip",10, 2);
                }
                break;
            case 4:
                {
                    removeOidestMobEvent(this);
                    addMobEvent(this, 1000, "mob4", "mob4_anim", 40, 0.7,50);
                    setAttackScale(this, "catnip", 3);
                }
                break;
            case 5:
                {
                    //removeAttack(this, "claw");
                    addAttackEvent(this, "beam", 10, 1 ,1000);
                }
                break;
            case 6:
                {
                    setAttackScale(this, "beam", 2);
                    setAttackDamage(this, "beam", 40);
                }
                break;
            case 7:
                {
                    addMob(this,"lion","lion_anim",200,0,100);
                    setBackground(this, "background2");
                }
                break;
        }
    }

    updatePlayerUI()
    {
        this.m_expBar.setValue(this.m_player.m_currentExp,this.m_player.m_maxExp);  
        this.m_topBar.setValue(this.m_player.m_mobsKilled,this.m_player.m_level);
    }

    movePlayerManager()
    {
        let vector = [0,0];
        if(this.m_cursorKeys.left.isDown)
            vector[0] -= 1;
        else if(this.m_cursorKeys.right.isDown)
            vector[0] += 1;

        if(this.m_cursorKeys.up.isDown)
            vector[1] -= 1;
        else if(this.m_cursorKeys.down.isDown)
            vector[1] += 1;

        this.m_player.move(vector);

        this.m_weaponStatic.children.each(weapon => 
        {
            weapon.move(vector);
        }, this);
    }
}