export class PhysicsConfig {

    public static physicsObjects = {

        character: {
            gravity_scale: 5,
            density: 10
        },
        gems: {
            gravity_scale: 4,
            density: 1
        },
        lava: {
            gravity_scale: 4,
            density: 1
        },
        water: {
            gravity_scale: 4,
            density: 1
        },
        snow: {
            gravity_scale: 4,
            density: 1
        },
        rock: {
            gravity_scale: 5,
            density: 50
        },
        big_stone: {
            gravity_scale: 5,
            density: 50
        },
        chest: {
            gravity_scale: 5,
            density: 50
        },
        item: {
            gravity_scale: 5,
            density: 50
        },
        bomb: {
            gravity_scale: 5,
            density: 20
        }
    };

    public static initPhysicConfig(node, name) {
        let physic = node.getComponent(cc.PhysicsCollider);
        let body = node.getComponent(cc.RigidBody);
        if (physic && body) {
            let config = PhysicsConfig.physicsObjects[name];
            if (config) {
                body.gravityScale = config['gravity_scale'];
                physic.density = config['density'];
            }
        } else {
            cc.warn("can not init physics config: " + name);
        }
    }

}