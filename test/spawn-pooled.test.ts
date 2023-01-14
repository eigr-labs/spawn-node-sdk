import { ChangeUserNameStatus, ChangeUserNameResponse, ChangeUserName } from './protos/user_test'
import spawn, { payloadFor, SpawnSystem } from '../src/spawn'
import { createPooledActor } from './stubs/actors'

describe('testing spawn pooled actor', () => {
  let system: SpawnSystem

  beforeAll(async () => {
    system = spawn.createSystem('spawn_sys_test')

    createPooledActor(system)

    await system.register()
  })

  afterAll(async () => {
    await system.destroy()
  })

  test('calling a stateless function in a pooled actor', async () => {
    const expected = ChangeUserNameResponse.create({
      status: ChangeUserNameStatus.OK,
      newName: 'namePooledCall-set'
    })

    const payload = payloadFor(ChangeUserName, ChangeUserName.create({ newName: 'namePooledCall' }))
    const command = 'setName'

    const newNameResponse = await spawn.invoke('pooledActorTest', {
      command,
      payload,
      response: ChangeUserNameResponse,
      system: 'spawn_sys_test'
    })

    expect(newNameResponse.newName).toBe(expected.newName)
    expect(newNameResponse.status).toBe(expected.status)
  })
})
