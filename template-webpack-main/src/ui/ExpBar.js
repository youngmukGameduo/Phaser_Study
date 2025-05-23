import Phaser from "phaser";
import Config from "../Config";
import {clamp} from "../utils/math";

export default class ExpBar extends Phaser.GameObjects.Graphics
{
    constructor(scene)
    {
        super(scene);

        this.HEIGHT = 30;
        this.BORDER = 4;

        this.m_x = 0;
        this.m_y = 30;

        this.m_currentExp = 0;
        this.m_maxExp = 0;

        this.draw();
        this.setDepth(100);
        this.setScrollFactor(0);
        
        scene.add.existing(this);
    }

    setValue(currentExp, maxExp)
    {
        this.m_currentExp = currentExp;
        this.m_maxExp = maxExp;
        this.draw();
    }

    draw()
    {
        this.clear();

        this.fillStyle(0x000000);
        this.fillRect(this.m_x,this.m_y, Config.width, this.HEIGHT);

        this.fillStyle(0xffffff);
        this.fillRect(this.m_x + this.BORDER , Config.width - 2 * this.BORDER, this.HEIGHT - 2 * this.BORDER);

        let rate = this.m_maxExp == 0 ? 0 : (this.m_currentExp / this.m_maxExp);
        let d = Math.floor((Config.width - 2 * this.BORDER) * rate);
        this.fillStyle(0x3665d5);
        this.fillRect(this.m_x + this.BORDER,this.m_y + this.BORDER,d,this.HEIGHT - 2 * this.BORDER);
    }

}