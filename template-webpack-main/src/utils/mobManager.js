import Mob from "../characters/Mob";
import {getRandomPosition} from "./math";

export function addMobEvent(scene, repeatGap, mobTexture, mobAnim, mobHp, mobDropRate,speed)
{
    let timer = scene.time.addEvent({
        delay: repeatGap,
        callback: ()=>
        {
            addMob(scene,mobTexture,mobAnim,mobHp,mobDropRate,speed);
        },
        loop: true,
    });

    scene.m_mobEvents.push(timer);
}

export function addMob(scene, mobTexture, mobAnim, mobHp, speed)
{
    let[x, y] = getRandomPosition(scene.m_player.x, scene.m_player.y);
    scene.m_mobs.add(new Mob(scene,x,y,mobTexture,mobAnim,mobHp,speed));
}

export function removeOidestMobEvent(scene)
{
    scene.m_mobEvents[0].remove();
    scene.m_mobEvents.shift();
}