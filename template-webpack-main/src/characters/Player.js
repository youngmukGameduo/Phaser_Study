import Phaser from "phaser";
import Config from "../Config";
import HpBar from "../ui/HpBar";
import { loseGame } from "../utils/sceneManager";

export default class Player extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene)
    {
        super(scene,Config.width/2,Config.height/2, "player");
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scale = 2;
        this.setDepth(20);
        this.setBodySize(28,32);
        this.m_moving = false;
        this.m_canBeAttacked = true;
        this.m_level = 1;
        this.m_mobsKilled = 0;
        this.m_currentExp = 0;
        this.m_maxExp = 20;
        this.m_isActive = true;

        this.m_hpBar = new HpBar(scene, this, 100);
    }

    move(vector)
    {
        
        let PLAYER_SPEED = 3;
        
        
        if(this.m_isActive === false)
        {
            vector[0] = 0;
            vector[1] = 0;       
        }
        else
        {
            if(vector[0] === -1)
                this.flipX = false;
            else if(vector[0] === 1)
                this.flipX = true;
        }
            
        this.x += vector[0] * PLAYER_SPEED;
        this.y += vector[1] * PLAYER_SPEED;
        
         // 이동 중 애니메이션 처리
        if (vector[0] !== 0 || vector[1] !== 0) 
        {
            if (!this.m_moving) 
            {
                this.play("player_anim", true); // 플레이어 이동 애니메이션 시작
                this.m_moving = true;
            }
        } 
        else 
        {
            if (this.m_moving) 
            {
                this.play("player_idle", true); // 대기 애니메이션으로 전환
                this.m_moving = false;
            }
        }
    }

    hitByMob(damage)
    {
        if(this.m_isActive === false)
            return;

        if(this.m_canBeAttacked === false)
            return;
        this.scene.m_hurtSound.play();
        this.getCooldown();

        this.m_hpBar.decrease(damage);

        if (this.m_hpBar.m_currentHp <= 0) 
        {
            loseGame(this.scene);
        }
    }

    getCooldown()
    {    
        if(this.m_isActive === false)
            return;

        this.m_canBeAttacked = false;
        this.alpha = 0.5;
        this.scene.time.addEvent(
        {
            delay: 1000,
            callback: ()=>
            {
                this.alpha = 1;
                this.m_canBeAttacked = true;
            },
            callbackScope: this,
            loop: false,
        });
    }

    getExp(value)
    {
        if(this.m_isActive === false)
            return;

        this.m_currentExp += value;
        if(this.m_currentExp < 0)
            this.m_currentExp = 0;

        while(this.m_currentExp >= this.m_maxExp)
        {
            this.m_currentExp -= this.m_maxExp;
            this.m_maxExp += 20;

            this.m_level++;
        }
    }
}