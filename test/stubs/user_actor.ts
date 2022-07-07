import { ActorEntity, Command } from "@spawn/decorators/actor";
import { ActorOpts } from "@spawn/client_actor/actor_opts";
import { UserState, ChangeUserName, ChangeUserNameResponse, ChangeUserNameStatus } from "../protos/user_test";
import { ActorContext, Value } from '@spawn/client_actor/actor_context'

@ActorEntity("user_actor_01", UserState, {persistent: true, snapshotTimeout: 10000n, deactivatedTimeout: 5000000n} as ActorOpts)
export class UserActor {
    context: ActorContext<UserState> | null = null

    @Command('reply')
    get(context: ActorContext<UserState>): Value<UserState> {
        return context.getState() // or just access directly context.state
    }

    @Command('reply', ChangeUserName)
    setName(message: ChangeUserName, context: ActorContext<UserState>): Value<ChangeUserNameResponse> {
        context.setState({...context.state, name: message.newName})

        return ChangeUserNameResponse.create({ newName: message.newName, status: ChangeUserNameStatus.OK })
    }

    static toString() {
        return 'user_actor_01'
    }
}

