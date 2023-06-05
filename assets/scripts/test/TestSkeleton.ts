const {ccclass, property} = cc._decorator;

@ccclass
export default class TestSkeleton extends cc.Component {

    @property(sp.Skeleton)
    skeleton: sp.Skeleton = null;

    changeSkin(){
        this.skeleton.setSkin("Boss0/Stick");
        this.skeleton.setSlotsToSetupPose();
        this.skeleton.setAnimation(0, "Idle", true);
    }

    protected onEnable(): void {
        cc.log("TestSkeleton");
        // this.skeleton.setSkin("Boss0/Stick");
        // this.skeleton.setSlotsToSetupPose();
        // this.skeleton.setAnimation(0, "Idle", true);
    }

}
