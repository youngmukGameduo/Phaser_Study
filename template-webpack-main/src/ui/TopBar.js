import Phaser from "phaser";
import Config from "../Config";

export default class TopBar extends Phaser.GameObjects.Graphics
{
    constructor(scene)
    {
        super(scene);

        this.fillStyle(0x28288c);
        this.fillRect(0,0,Config.width, 30);
        this.setDepth(90);
        this.setScrollFactor(0);

        this.m_mobsKilled = 0;
        this.m_level = 0;
        
        scene.add.existing(this);

        this.setValue(0,0);
    }

    setValue(mobsSkilled,level)
    {
        this.m_mobsKilled = mobsSkilled;
        this.m_level = level;
        this.updateUI();
    }

    updateUI()
    {
        const mobs = this.m_mobsKilled ?? 0;
        const level = this.m_level ?? 0;

        const mobStr = `MOBS KILLED ${mobs.toString().padStart(6, "0")}`;
        const levelStr = `LEVEL ${level.toString().padStart(3, "0")}`;

        if(!this.m_mobsKilledLabel)
        {
            this.m_mobsKilledLabel = this.scene.add.bitmapText(5,1,"pixelFont",mobStr,40);
            this.m_mobsKilledLabel.setScrollFactor(0);
            this.m_mobsKilledLabel.setDepth(100);
        }
        else
        {
            this.m_mobsKilledLabel.setText(mobStr);
        }

        if(!this.m_levelLabel)
        {
            this.m_levelLabel = this.scene.add.bitmapText(650,1,"pixelFont",levelStr,40);
            this.m_levelLabel.setScrollFactor(0);
            this.m_levelLabel.setDepth(100);
        }
        else
        {
            this.m_levelLabel.setText(levelStr);
        }
    }
}