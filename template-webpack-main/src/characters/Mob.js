import Phaser from "phaser";
import Explosion from "../effects/Explosion";
import ExpUp from "../items/ExpUp";
import { removeAttack } from "../utils/attackManager";
import { winGame } from "../utils/sceneManager";

export default class Mob extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, animKey, initHp, dropRate,speed) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.play(animKey);
        this.setDepth(10);
        this.scale = 2;

        this.m_speed = speed;
        this.m_hp = initHp;
        this.m_dropRate = dropRate;
        this.m_isActive = true;

        switch(texture) {
            case "mob1":
                this.setBodySize(24, 14, false);
                this.setOffset(0, 14);
                break;
            case "mob2":
            case "mob3":
            case "mob4":
                this.setBodySize(24, 32);
                break;
            case "lion":
                this.setBodySize(40, 64);
                break;
        }

        // 플레이어 추적용 이벤트 추가
        this.m_events = [];
        this.m_events.push(
            this.scene.time.addEvent({
                delay: 100,
                callback: () => 
                {
                    if(this.m_isActive === false)
                    {
                        this.setVelocity(0);
                        return;
                    }
                    scene.physics.moveToObject(this, this.scene.m_player, this.m_speed);
                },
                loop: true,
            })
        );

        // update 연결 (바인딩 저장해서 제거 가능하도록)
        this._boundUpdate = this.update.bind(this);
        this.scene.events.on("update", this._boundUpdate);

        this.m_canBeAttacked = true;
    }

    update() 
    {
        // 이미 파괴되었거나 body가 없을 경우 무시
        if (!this.body || !this.scene || !this.scene.m_player) 
            return;

        this.flipX = this.x < this.scene.m_player.x;

        if (this.m_hp <= 0) 
        {
            this.die();
        }
    }

    hitByDynamic(weaponDynamic, damage) 
    {
        this.scene.m_hitMobSound.play();
        this.m_hp -= damage;
        this.displayHit();
        weaponDynamic.destroy();
    }

    hitByStatic(damage) 
    {
        if (!this.m_canBeAttacked) 
            return;

        this.scene.m_hitMobSound.play();
        this.m_hp -= damage;
        this.displayHit();
        this.getCoolDown();
    }

    displayHit() 
    {
        if(this.m_isActive === false)
            return;

        if(this.texture.key === "lion")
            return;

        this.alpha = 0.5;
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => 
            {
                this.alpha = 1;
            },
            loop: false,
        });
    }

    getCoolDown() 
    {
        this.m_canBeAttacked = false;
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => 
            {
                this.m_canBeAttacked = true;
            },
            loop: false,
        });
    }

    die() 
    {
        if(this.m_isActive === false)
            return;
        if(this.m_isDead)
            return;
        this.m_isDead = true;

        if(Math.random() < this.m_dropRate)
        {
            const expUp = new ExpUp(this.scene, this);
            this.scene.m_expUps.add(expUp);
        }       
        this.scene.m_player.m_mobsKilled++;        
        this.scene.updatePlayerUI();
            
        // 타이머 제거
        this.m_events.forEach(event => 
        {
            this.scene.time.removeEvent(event);
        });
                
        // update 이벤트 해제
        this.scene.events.off("update", this._boundUpdate);
        
        if(this.texture.key === "lion")
        {
            //보스를 잡음
            //게임 종료처리
            this.scene.m_player.m_isActive = false;
            this.setVelocity(0);
            
            removeAttack(this.scene, "catnip");
            removeAttack(this.scene, "beam");
            removeAttack(this.scene, "claw");

            this.scene.m_mobs.getChildren().forEach(mob => 
            {
                mob.m_isActive = false;
            });

            this.scene.time.addEvent(
            {
                delay: 30,
                callback: () => 
                {
                    this.alpha -= 0.01;
                },
                repeat: 100,
            });

            this.scene.time.addEvent(
            {
                delay: 4000,
                callback: () => 
                {
                    winGame(this.scene);
                },
                loop: false,
            });
        }
        else
        {
            new Explosion(this.scene, this.x, this.y);
            this.scene.m_explosionSound.play();

            // 그룹에서 제거
            this.scene.m_mobs.remove(this, true, true); // destroy 포함
            
        }      
    }
}
