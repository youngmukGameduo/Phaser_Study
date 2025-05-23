import Config from "../Config";

export function setBackground(scene, backgroundTexture)
{
    scene.m_background = scene.add.tileSprite(0,0,Config.width*3,Config.height*3,backgroundTexture).setOrigin(0,0);
}