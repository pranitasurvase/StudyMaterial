// MCQs
import historyMCQs from './mcqs/history'
import geographyMCQs from './mcqs/geography'
import polityMCQs from './mcqs/polity'
import economyMCQs from './mcqs/economy'
import scienceMCQs from './mcqs/science'
import environmentMCQs from './mcqs/environment'
import currentAffairsMCQs from './mcqs/current-affairs'
import csatMCQs from './mcqs/csat'
import ancientHistoryMCQs from './mcqs/ancient-history'

// Descriptive
import historyDescriptive from './descriptive/history'
import geographyDescriptive from './descriptive/geography'
import polityDescriptive from './descriptive/polity'
import economyDescriptive from './descriptive/economy'
import scienceDescriptive from './descriptive/science'
import environmentDescriptive from './descriptive/environment'
import currentAffairsDescriptive from './descriptive/current-affairs'
import csatDescriptive from './descriptive/csat'

export const mcqData = {
  'History': historyMCQs,
  'Ancient History': ancientHistoryMCQs,
  'Geography': geographyMCQs,
  'Polity': polityMCQs,
  'Economy': economyMCQs,
  'Science': scienceMCQs,
  'Environment': environmentMCQs,
  'Current Affairs': currentAffairsMCQs,
  'CSAT': csatMCQs,
}

export const descriptiveData = {
  'History': historyDescriptive,
  'Geography': geographyDescriptive,
  'Polity': polityDescriptive,
  'Economy': economyDescriptive,
  'Science': scienceDescriptive,
  'Environment': environmentDescriptive,
  'Current Affairs': currentAffairsDescriptive,
  'CSAT': csatDescriptive,
}
