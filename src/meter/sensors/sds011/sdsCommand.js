import { WorkState, DutyCycle } from './commandTypes'
import { SettingMode } from './sdsConsts'

const workingMode = 0
export const createResumeCommand = () => ({ commandType: DutyCycle, data: [SettingMode] })
export const createPauseCommand = () => ({ commandType: WorkState, data: [SettingMode, workingMode] })
