import Beam from "../effects/Beam";
import Claw from "../effects/Claw";
import Catnip from "../effects/Catnip";

export function addAttackEvent(scene, attackType, attackDamage, attackScale, repeatGap)
{
    switch(attackType)
    {
        case "beam":
        case "claw":
            {
                const timer = scene.time.addEvent({
                    delay: repeatGap,
                    callback: () => 
                    {
                        doAttackOneSet(scene,attackType, attackDamage, attackScale);
                    },
                    loop: true,
                });
                scene.m_attackEvents[attackType] = { timer,damage: attackDamage,scale: attackScale,repeatGap };
            }
            break;
        case "catnip":
            {
                const catnip = new Catnip(scene,[scene.m_player.x, scene.m_player.y + 20], attackDamage, attackScale);
                scene.m_attackEvents[attackType] = { object: catnip, damage: attackDamage };
            }
            break;

    }
}

function doAttackOneSet(scene, attackType, damage, scale)
{
    switch(attackType)
    {
        case "beam":
            {
                new Beam(scene, [scene.m_player.x,scene.m_player.y - 16], damage, scale);
            }
            break;
        case "claw":
            {
                const isHeadingRight = scene.m_player.flipX;
                new Claw(scene, [scene.m_player.x - 60 + 120 * isHeadingRight, scene.m_player.y - 40], isHeadingRight, damage, scale);

                scene.time.addEvent(
                    {
                        delay: 500,
                        callback: ()=>
                        {
                            new Claw(scene, [scene.m_player.x - 60 + 120 * !isHeadingRight, scene.m_player.y - 40], !isHeadingRight, damage, scale);
                        },
                        loop: false,
                    }
                );
            }
            break;
    }


}

export function removeAttack(scene, attackType)
{
    if(scene.m_attackEvents[attackType] == null)
        return;

    if(attackType == "catnip")
    {
        scene.m_attackEvents[attackType].object.destroy();
        return;
    }

    scene.time.removeEvent(scene.m_attackEvents[attackType].timer);
}

export function setAttackDamage(scene, attackType, newDamage)
{
    const scale = scene.m_attackEvents[attackType].scale;
    const repeatGap = scene.m_attackEvents[attackType].repeatGap;
    removeAttack(scene,attackType);
    addAttackEvent(scene,attackType,newDamage,scale, repeatGap);

}

export function setAttackScale(scene, attackType, newScale)
{
    const damage = scene.m_attackEvents[attackType].damage;
    const repeatGap = scene.m_attackEvents[attackType].repeatGap;
    removeAttack(scene, attackType);
    addAttackEvent(scene, attackType, damage, newScale, repeatGap);
}

export function setAttackRepeatGap(scene, attackType, newReapetGap)
{
    const damage = scene.m_attackEvents[attackType].damage;
    const scale = scene.m_attackEvents[attackType].scale;
    removeAttack(scene, attackType);
    addAttackEvent(scene, attackType, damage, scale, newReapetGap);
}