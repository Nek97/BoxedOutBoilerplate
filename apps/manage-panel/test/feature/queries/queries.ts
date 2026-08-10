export const ManageMonitor_getRefundCustomerGrid_0 = `query {
ManageMonitor_getRefundCustomerGrid(
startRow: 0
endRow: 20
sorting: [ { colId: status, sort: ASC } ]

) {
nodes{
status
verifier1
verifier2
guid
amount
reason
iban
ibanAccountHolder
comment
id
requestId
createdAt
updatedAt
}
}
}`;
export const ManageMonitor_getAsset_0 = `query {
ManageMonitor_getAsset(
ID:"testingEntry"
){
userId
ID
transferAsset
transferAmount
transferValue
metadataUserValueVelocity
metadataUserCountVelocity
metadataAnyTransferInactivityDays
metadataSimilarTransferInactivityDays
metadataSimilarTransactionValue7d
metadataSimilarTransactionValue30d
metadataSimilarTransactionValue90d
created
updated
timestampCreated
transferDirection
transferMethod
transferDestination
taintPreTransferEntity
taintPreTransferType
countryInitiated
metadataOutgoingAddressUserCount
metadataRepetitiveTransactionCount
timestampManual
timestampTaintAnalysis
transferStatus
monitorStatus
transferPreChecks
transferPostChecks
transferPreChecksEyes
transferPostCheckEyes
taintPostTransferEntity
taintPostTransferType
monitorStatusInfo
}
}`;
export const ManageMonitor_getAssetGrid_0 = `query {
ManageMonitor_getAssetGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

) {
nodes{
userId
ID
transferAsset
transferAmount
transferValue
metadataUserValueVelocity
metadataUserCountVelocity
metadataAnyTransferInactivityDays
metadataSimilarTransferInactivityDays
metadataSimilarTransactionValue7d
metadataSimilarTransactionValue30d
metadataSimilarTransactionValue90d
created
updated
timestampCreated
transferDirection
transferMethod
transferDestination
taintPreTransferEntity
taintPreTransferType
countryInitiated
metadataOutgoingAddressUserCount
metadataRepetitiveTransactionCount
timestampManual
timestampTaintAnalysis
transferStatus
monitorStatus
transferPreChecks
transferPostChecks
transferPreChecksEyes
transferPostCheckEyes
taintPostTransferEntity
taintPostTransferType
monitorStatusInfo
}
}
}`;
export const ManageMonitor_getAssetGridByUserId_0 = `query {
ManageMonitor_getAssetGridByUserId(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
userId
ID
transferAsset
transferAmount
transferValue
metadataUserValueVelocity
metadataUserCountVelocity
metadataAnyTransferInactivityDays
metadataSimilarTransferInactivityDays
metadataSimilarTransactionValue7d
metadataSimilarTransactionValue30d
metadataSimilarTransactionValue90d
created
updated
timestampCreated
transferDirection
transferMethod
transferDestination
taintPreTransferEntity
taintPreTransferType
countryInitiated
metadataOutgoingAddressUserCount
metadataRepetitiveTransactionCount
timestampManual
timestampTaintAnalysis
transferStatus
monitorStatus
transferPreChecks
transferPostChecks
transferPreChecksEyes
transferPostCheckEyes
taintPostTransferEntity
taintPostTransferType
monitorStatusInfo
}
}
}`;
export const ManageMonitor_getFiat_0 = `query {
ManageMonitor_getFiat(
ID:"testingEntry"
){
userId
ID
transferAmount
transferValue
metadataUserValueVelocity
metadataUserCountVelocity
metadataAnyTransferInactivityDays
metadataSimilarTransferInactivityDays
metadataSimilarTransactionValue7d
metadataSimilarTransactionValue30d
metadataSimilarTransactionValue90d
created
updated
timestampCreated
transferAsset
transferDirection
transferMethod
transferCounterparty
transferBank
countryBank
countryInitiated
metadataRepetitiveTransactionCount
timestampManual
timestampTaintAnalysis
transferStatus
monitorStatus
transferPreChecks
transferPostChecks
transferPreChecksEyes
transferPostCheckEyes
transferBankRisk
}
}`;
export const ManageMonitor_getFiatGrid_0 = `query {
ManageMonitor_getFiatGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

) {
nodes{
userId
ID
transferAmount
transferValue
metadataUserValueVelocity
metadataUserCountVelocity
metadataAnyTransferInactivityDays
metadataSimilarTransferInactivityDays
metadataSimilarTransactionValue7d
metadataSimilarTransactionValue30d
metadataSimilarTransactionValue90d
created
updated
timestampCreated
transferAsset
transferDirection
transferMethod
transferCounterparty
transferBank
countryBank
countryInitiated
metadataRepetitiveTransactionCount
timestampManual
timestampTaintAnalysis
transferStatus
monitorStatus
transferPreChecks
transferPostChecks
transferPreChecksEyes
transferPostCheckEyes
transferBankRisk
}
}
}`;
export const ManageMonitor_getFiatGridByUserId_0 = `query {
ManageMonitor_getFiatGridByUserId(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
userId
ID
transferAmount
transferValue
metadataUserValueVelocity
metadataUserCountVelocity
metadataAnyTransferInactivityDays
metadataSimilarTransferInactivityDays
metadataSimilarTransactionValue7d
metadataSimilarTransactionValue30d
metadataSimilarTransactionValue90d
created
updated
timestampCreated
transferAsset
transferDirection
transferMethod
transferCounterparty
transferBank
countryBank
countryInitiated
metadataRepetitiveTransactionCount
timestampManual
timestampTaintAnalysis
transferStatus
monitorStatus
transferPreChecks
transferPostChecks
transferPreChecksEyes
transferPostCheckEyes
transferBankRisk
}
}
}`;
export const ManageMonitor_getUserRiskProfileScore_0 = `query {
ManageMonitor_getUserRiskProfileScore(
userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
){
ageAtOnboard
purposeOfTheAccount
sourceOfFounds
expectedAnnual
typeOfID
issuingCountry
emailProvider
bank
inconsistentFactor
}
}`;
export const ManageMonitor_getUserDynamic_0 = `query {
ManageMonitor_getUserDynamic(
ID:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
){
userId
tradingBalance
tradingTotalVolume
tradingMakerVolume
tradingTakerVolume
tradingTransferToTrade
transfersFiatIn
transfersFiatOut
transfersFiatNet
transfersFiatSum
transfersAssetsIn
transfersAssetsOut
transfersAssetsNet
transfersAssetsSum
timestamp
timestampCreated
timestampActive
timestampFiatIn
timestampFiatOut
timestampAssetsIn
timestampAssetsOut
timestampTransfer
timestampTrade
userEmail
userTwoFactor
userUsedAffiliate
userIsAffiliate
userUsesApp
userUsesApi
userUsesWhitelist
adminCommentCount
identityNationality
identityIssuingCountry
identityGender
identityBirthdate
countryIpCreated
countryIpMostActions
countryIpLastUsed
countryPhone
countryBank
tradingBalanceAssetCount
tradingAssetCount
tradingFeeTier
transferAssetsSymbolCount
transferAssetsAddressCount
riskCrime
riskMule
riskFiatScam
riskFiatTheft
riskCryptoScam
riskCryptoTheft
}
}`;
export const ManageMonitor_getUserDynamicGrid_0 = `query {
ManageMonitor_getUserDynamicGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

) {
nodes{
userId
tradingBalance
tradingTotalVolume
tradingMakerVolume
tradingTakerVolume
tradingTransferToTrade
transfersFiatIn
transfersFiatOut
transfersFiatNet
transfersFiatSum
transfersAssetsIn
transfersAssetsOut
transfersAssetsNet
transfersAssetsSum
timestamp
timestampCreated
timestampActive
timestampFiatIn
timestampFiatOut
timestampAssetsIn
timestampAssetsOut
timestampTransfer
timestampTrade
userEmail
userTwoFactor
userUsedAffiliate
userIsAffiliate
userUsesApp
userUsesApi
userUsesWhitelist
adminCommentCount
identityNationality
identityIssuingCountry
identityGender
identityBirthdate
countryIpCreated
countryIpMostActions
countryIpLastUsed
countryPhone
countryBank
tradingBalanceAssetCount
tradingAssetCount
tradingFeeTier
transferAssetsSymbolCount
transferAssetsAddressCount
riskCrime
riskMule
riskFiatScam
riskFiatTheft
riskCryptoScam
riskCryptoTheft
}
}
}`;
export const ManageMonitor_getTagGrid_0 = `query {
ManageMonitor_getTagGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "ID", sort: ASC } ]

) {
nodes{
ID
color
description
}
}
}`;
export const ManageUser_getUserIdentity_0 = `query {
ManageUser_getUserIdentity(
ID:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
){
guid
source
firstName
lastName
gender
dateOfBirth
countryOfBirth
countryOfDocument
watchlistChecked
encrypted
}
}`;
export const ManageUser_getUserIdentityGrid_0 = `query {
ManageUser_getUserIdentityGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "guid", sort: ASC } ]

) {
nodes{
guid
source
firstName
lastName
gender
dateOfBirth
countryOfBirth
countryOfDocument
watchlistChecked
encrypted
}
}
}`;
export const ManageMonitor_getUserTagGridByUserId_0 = `query {
ManageMonitor_getUserTagGridByUserId(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
userId
tag
timestamp
}
}
}`;
export const ManageMonitor_getUserTagGridByTag_0 = `query {
ManageMonitor_getUserTagGridByTag(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

tag:"testingEntry"
) {
nodes{
userId
tag
timestamp
}
}
}`;
export const ManageMonitor_getLogActionGrid_0 = `query {
ManageMonitor_getLogActionGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "adminId", sort: ASC } ]

) {
nodes{
adminId
userId
timestamp
ip
device
type
data
}
}
}`;
export const ManageMonitor_getLogActionGridSelf_0 = `query {
ManageMonitor_getLogActionGridSelf(
startRow: 0
endRow: 20
sorting: [ { colId: "adminId", sort: ASC } ]

) {
nodes{
adminId
userId
timestamp
ip
device
type
data
}
}
}`;
export const ManageMonitor_getLogActionGridByUserId_0 = `query {
ManageMonitor_getLogActionGridByUserId(
startRow: 0
endRow: 20
sorting: [ { colId: "adminId", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
adminId
userId
timestamp
ip
device
type
data
}
}
}`;
export const ManageMonitor_getFiuNotificationGrid_0 = `query {
ManageMonitor_getFiuNotificationGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "ID", sort: ASC } ]

) {
nodes{
ID
generated
submitted
userId
type
referenceId
fiuId
data
}
}
}`;
export const ManageMonitor_getLogViewGrid_0 = `query {
ManageMonitor_getLogViewGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "adminId", sort: ASC } ]

) {
nodes{
adminId
userId
timestamp
ip
device
type
data
}
}
}`;
export const ManageMonitor_getCommentGridByUserId_0 = `query {
ManageMonitor_getCommentGridByUserId(
startRow: 0
endRow: 20
sorting: [ { colId: "adminId", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
adminId
userId
ID
type
timestamp
message
}
}
}`;
export const ManageMonitor_getCommentGridByAdminId_0 = `query {
ManageMonitor_getCommentGridByAdminId(
startRow: 0
endRow: 20
sorting: [ { colId: "adminId", sort: ASC } ]

adminId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
adminId
userId
ID
type
timestamp
message
}
}
}`;
export const ManageMonitor_getWatchlistHitGridByUserId_0 = `query {
ManageMonitor_getWatchlistHitGridByUserId(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
userId
timestamp
possibleMatch
cleared
}
}
}`;
export const ManageMonitor_getWatchlistHitGrid_0 = `query {
ManageMonitor_getWatchlistHitGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

) {
nodes{
userId
timestamp
possibleMatch
cleared
}
}
}`;
export const ManageMonitor_getAllowedAddressbookDomainGrid_0 = `query {
ManageMonitor_getAllowedAddressbookDomainGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "added", sort: ASC } ]

) {
nodes{
added
domain
service
custodial
}
}
}`;
export const ManageMonitor_getTransferClassifierKnownAtProcessingGrid_0 = `query {
ManageMonitor_getTransferClassifierKnownAtProcessingGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "ID", sort: ASC } ]

) {
nodes{
ID
dataKnown
rulesAtTime
}
}
}`;
export const ManageMonitor_getUserIdentityRequestGrid_0 = `query {
ManageMonitor_getUserIdentityRequestGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

) {
nodes{
userId
}
}
}`;
export const ManageMonitor_getAllowedIpGrid_0 = `query {
ManageMonitor_getAllowedIpGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "ip", sort: ASC } ]

) {
nodes{
ip
description
}
}
}`;
export const ManageMonitor_getListLexisGrid_0 = `query {
ManageMonitor_getListLexisGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "name", sort: ASC } ]

) {
nodes{
name
list
timestamp
data
}
}
}`;
export const ManageMonitor_getCorporatePersonOfInterestGrid_0 = `query {
ManageMonitor_getCorporatePersonOfInterestGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

) {
nodes{
userId
idType
companyRole
gender
xx
firstName
lastName
dateOfBirth
idNumber
idIssueCountry
nationality
IDIssuedDate
IdExpiryDate
UBOScope
}
}
}`;
export const ManageMonitor_getCorporatePersonOfInterestGridByUserId_0 = `query {
ManageMonitor_getCorporatePersonOfInterestGridByUserId(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
userId
idType
companyRole
gender
xx
firstName
lastName
dateOfBirth
idNumber
idIssueCountry
nationality
IDIssuedDate
IdExpiryDate
UBOScope
}
}
}`;
export const ManageUser_getUserGrid_0 = `query {
ManageUser_getUserGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "ID", sort: ASC } ]

) {
nodes{
ID
antiPhishing
affiliatePct
rebateAmount
feeVolume
feeTakerBps
feeMakerBps
firstName
lastName
boxedoutLock
userLock
withdrawalLock
tradingLock
euroInLock
euroOutLock
cryptoInLock
cryptoOutLock
created
profileLoaded
country
language
twoFactor
twoFactorKey
twoFactorLatest
bankKey
affiliate
affiliateLink
affiliateCount
affiliateStats
stakingEnabled
settingsNotifyIncorrectLogin
settingsNotifyDeposit
settingsNotifyWithdrawal
settingsNotifyDistribution
settingsNewsletter
settingsAcceptTransfers
overrideCooldown
trustpilot
rebateNewUser
rebateValidUntil
unsubscribeToken
videoVerificationRequest
videoVerificationPassed
limitDailyWithdrawal
proofOfFundsNewRequest
proofOfFundsEmergencyBrake
proofOfFundsDeadline
idVerifyDeadline
accountDeleted
addressbookEnabled
feeTier
rateLimitRequests
rateLimitOrdersSec
rateLimitOrdersDay
}
}
}`;
export const ManageUser_getUserForAgentGrid_0 = `query {
ManageUser_getUserForAgentGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "ID", sort: ASC } ]

) {
nodes{
ID
firstName
lastName
bankKey
affiliateLink
}
}
}`;
export const ManageUser_getUser_0 = `query {
ManageUser_getUser(
ID:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
){
ID
antiPhishing
affiliatePct
rebateAmount
feeVolume
feeTakerBps
feeMakerBps
firstName
lastName
boxedoutLock
userLock
withdrawalLock
tradingLock
euroInLock
euroOutLock
cryptoInLock
cryptoOutLock
created
profileLoaded
country
language
twoFactor
twoFactorKey
twoFactorLatest
bankKey
affiliate
affiliateLink
affiliateCount
affiliateStats
stakingEnabled
settingsNotifyIncorrectLogin
settingsNotifyDeposit
settingsNotifyWithdrawal
settingsNotifyDistribution
settingsNewsletter
settingsAcceptTransfers
overrideCooldown
trustpilot
rebateNewUser
rebateValidUntil
unsubscribeToken
videoVerificationRequest
videoVerificationPassed
limitDailyWithdrawal
proofOfFundsNewRequest
proofOfFundsEmergencyBrake
proofOfFundsDeadline
idVerifyDeadline
accountDeleted
addressbookEnabled
feeTier
rateLimitRequests
rateLimitOrdersSec
rateLimitOrdersDay
}
}`;
export const ManageUser_getUserIdentityDocument_0 = `query {
ManageUser_getUserIdentityDocument(
xx:12345
){
ID
userId
verificationLock
status
verifiedTimestamp
reason
timestamp
data
documentNumberHash
documentBaseDataHash
required
count
self
back
front
liveness
}
}`;
export const ManageUser_getUserIdentityDocumentForAgentGridByUserId_0 = `query {
ManageUser_getUserIdentityDocumentForAgentGridByUserId(
startRow: 0
endRow: 20
sorting: [ { colId: "ID", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
ID
userId
verificationLock
status
verifiedTimestamp
reason
timestamp
data
documentNumberHash
documentBaseDataHash
required
count
self
}
}
}`;
export const ManageUser_getUserIdentityDocumentGlobalGridOnRequest_0 = `query {
ManageUser_getUserIdentityDocumentGlobalGridOnRequest(
startRow: 0
endRow: 20
sorting: [ { colId: "ID", sort: ASC } ]

) {
nodes{
ID
userId
verificationLock
status
verifiedTimestamp
reason
timestamp
data
documentNumberHash
documentBaseDataHash
required
count
self
}
}
}`;
export const ManageUser_getUserIdentityDocumentGridByStatus_0 = `query {
ManageUser_getUserIdentityDocumentGridByStatus(
startRow: 0
endRow: 20
sorting: [ { colId: "ID", sort: ASC } ]

status:PENDING
) {
nodes{
ID
userId
verificationLock
status
verifiedTimestamp
reason
timestamp
data
documentNumberHash
documentBaseDataHash
required
count
self
}
}
}`;
export const ManageUser_getUserEmailGrid_0 = `query {
ManageUser_getUserEmailGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
userId
lastPasswordReset
lastTwoFactorReset
email
status
active
reminded
timestamp
lastLoginFailed
}
}
}`;
export const ManageUser_getUserPhoneGrid_0 = `query {
ManageUser_getUserPhoneGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
userId
phone
status
active
timestamp
}
}
}`;
export const ManageUser_getUserMobileDeviceGrid_0 = `query {
ManageUser_getUserMobileDeviceGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
userId
timestamp
token
active
deviceName
deviceInfo
}
}
}`;
export const ManageUser_getUserDeviceGrid_0 = `query {
ManageUser_getUserDeviceGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
userId
timestamp
token
active
deviceName
userAgent
}
}
}`;
export const ManageUser_getUserProofOfFunds_0 = `query {
ManageUser_getUserProofOfFunds(
userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
){
ID
userId
status
timestamp
verifiedTimestamp
fileUuids
}
}`;
export const ManageUser_getUserProofOfFundsGrid_0 = `query {
ManageUser_getUserProofOfFundsGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "ID", sort: ASC } ]

) {
nodes{
ID
userId
status
timestamp
verifiedTimestamp
fileUuids
}
}
}`;
export const ManageUser_getUserLogGridByUserId_0 = `query {
ManageUser_getUserLogGridByUserId(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
userId
timestamp
ip
userAgent
type
device
data
}
}
}`;
export const ManageUser_getUserLogGridAuditUser_0 = `query {
ManageUser_getUserLogGridAuditUser(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

ip:"127.0.0.254"
) {
nodes{
userId
timestamp
ip
userAgent
type
device
data
}
}
}`;
export const ManageUser_getUserLogGridAuditUser_1 = `query {
ManageUser_getUserLogGridAuditUser(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

device:"testingEntry"
) {
nodes{
userId
timestamp
ip
userAgent
type
device
data
}
}
}`;
export const ManageUser_getUserLogExtendedGrid_0 = `query {
ManageUser_getUserLogExtendedGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
userId
timestamp
ip
userAgent
type
device
data
asn
country
name
risk
}
}
}`;
export const ManageUser_getUserQuestionnaireGrid_0 = `query {
ManageUser_getUserQuestionnaireGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
userId
timestamp
status
data
}
}
}`;
export const ManageUser_getAssignedRoleGrid_0 = `query {
ManageUser_getAssignedRoleGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

) {
nodes{
userId
role
}
}
}`;
export const ManageUser_getAdminLogGridByAdminId_0 = `query {
ManageUser_getAdminLogGridByAdminId(
startRow: 0
endRow: 20
sorting: [ { colId: "adminId", sort: ASC } ]

adminId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
adminId
userId
timestamp
ip
userAgent
type
device
data
}
}
}`;
export const ManageUser_getAdminLogGridByUserId_0 = `query {
ManageUser_getAdminLogGridByUserId(
startRow: 0
endRow: 20
sorting: [ { colId: "adminId", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
adminId
userId
timestamp
ip
userAgent
type
device
data
}
}
}`;
export const ManageUser_getCorporateEntity_0 = `query {
ManageUser_getCorporateEntity(
userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
){
userId
name
chamberOfCommerceNumber
country
address
postalCode
placeOfEstablishment
countryOfstatutorySeat
}
}`;
export const ManageUser_getCorporateEntityGrid_0 = `query {
ManageUser_getCorporateEntityGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "userId", sort: ASC } ]

) {
nodes{
userId
name
chamberOfCommerceNumber
country
address
postalCode
placeOfEstablishment
countryOfstatutorySeat
}
}
}`;
export const ManageUser_getAddressbookGridByUserId_0 = `query {
ManageUser_getAddressbookGridByUserId(
startRow: 0
endRow: 20
sorting: [ { colId: "ID", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
ID
userId
uuid
created
updated
asset
address
paymentId
name
emailToken
statusCompliance
methodCompliance
methodComplianceVerified
ocrData
reason
service
custodial
statusSecurity
metadata
}
}
}`;
export const ManageUser_getAddressbookGrid_0 = `query {
ManageUser_getAddressbookGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "ID", sort: ASC } ]

) {
nodes{
ID
userId
uuid
created
updated
asset
address
paymentId
name
emailToken
statusCompliance
methodCompliance
methodComplianceVerified
ocrData
reason
service
custodial
statusSecurity
metadata
}
}
}`;
export const ManageUser_getUserCompensateGrid_0 = `query {
ManageUser_getUserCompensateGrid(
startRow: 0
endRow: 20
sorting: [ { colId: status, sort: ASC } ]

) {
nodes{
status
verifier1
verifier2
guid
amount
reason
comment
requestId
createdAt
updatedAt
}
}
}`;
export const ManageUser_getUserFile_0 = `query {
ManageUser_getUserFile(
ID:"1"
){
ID
referenceId
guid
category
type
filePath
timestamp
userId
}
}`;
export const ManageUser_getUserFileGrid_0 = `query {
ManageUser_getUserFileGrid(
startRow: 0
endRow: 20
sorting: [ { colId: ID, sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
ID
referenceId
guid
category
type
filePath
timestamp
userId
}
}
}`;
export const ManageUser_getUserAddress_0 = `query {
ManageUser_getUserAddress(
userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
){
userId
address
address2
postalCode
city
verificationStatus
country
}
}`;
export const ManageEURWallet_getBankAccountByUserId_0 = `query {
ManageEURWallet_getBankAccountByUserId(
userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
){
ID
userId
verifiedTimestamp
iban
accountHolder
status
reason
verifiedMethod
manualNameCheck
timestamp
}
}`;
export const ManageEURWallet_getBankAccountGridForCompliance_0 = `query {
ManageEURWallet_getBankAccountGridForCompliance(
startRow: 0
endRow: 20
sorting: [ { colId: "ID", sort: ASC } ]

status:PENDING
) {
nodes{
ID
userId
verifiedTimestamp
iban
accountHolder
status
reason
verifiedMethod
manualNameCheck
timestamp
}
}
}`;
export const ManageEURWallet_getBankAccountGridForCompliance_1 = `query {
ManageEURWallet_getBankAccountGridForCompliance(
startRow: 0
endRow: 20
sorting: [ { colId: "ID", sort: ASC } ]

manualNameCheck:CHECKED
) {
nodes{
ID
userId
verifiedTimestamp
iban
accountHolder
status
reason
verifiedMethod
manualNameCheck
timestamp
}
}
}`;
export const ManageEURWallet_getBankAccountGridForAgent_0 = `query {
ManageEURWallet_getBankAccountGridForAgent(
startRow: 0
endRow: 20
sorting: [ { colId: "ID", sort: ASC } ]

userId:"8ebc2ea0-6b32-445e-bfb2-016e4b5cab9a"
) {
nodes{
ID
userId
verifiedTimestamp
iban
accountHolder
status
reason
verifiedMethod
manualNameCheck
timestamp
}
}
}`;
export const ManageExchange_getMarketGrid_0 = `query {
ManageExchange_getMarketGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "base", sort: ASC } ]

) {
nodes{
base
quote
status
public
engineHeartbeat
pauseAt
enableAt
engineActive
minOrderBase
minOrderQuote
}
}
}`;
export const ManageExchange_getAssetGrid_0 = `query {
ManageExchange_getAssetGrid(
startRow: 0
endRow: 20
sorting: [ { colId: "symbol", sort: ASC } ]

) {
nodes{
symbol
public
name
confirmations
precisionAmount
depositFee
withdrawalFee
withdrawalMinAmount
statusDeposits
statusWithdrawals
networks
message
}
}
}`;
export const ManageAffiliate_getCustomCode_0 = `query {
ManageAffiliate_getCustomCode(
customCode:"aaaaa"
){
customCode
convertTo
}
}`;
export const ManageAffiliate_getCustomCodeGrid_0 = `query {
ManageAffiliate_getCustomCodeGrid(
startRow: 0
endRow: 20
sorting: [ { colId: customCode, sort: ASC } ]

) {
nodes{
customCode
convertTo
}
}
}`;
export const ManageStaking_getBoxedOutRewardRate_0 = `query {
ManageStaking_getBoxedOutRewardRate(
RewardID:"1"
){
RewardID
assetHold
assetReward
stakedAmount
enteredRewardYearly
dailyRewardPerUnit
rewardType
rewardReference
rewardYearlyEstimatePct
start
end
}
}`;
export const ManageStaking_getBoxedOutRewardRateGrid_0 = `query {
ManageStaking_getBoxedOutRewardRateGrid(
startRow: 0
endRow: 20
sorting: [ { colId: RewardID, sort: ASC } ]

) {
nodes{
RewardID
assetHold
assetReward
stakedAmount
enteredRewardYearly
dailyRewardPerUnit
rewardType
rewardReference
rewardYearlyEstimatePct
start
end
}
}
}`;
export const ManageStaking_getUserRewardRate_0 = `query {
ManageStaking_getUserRewardRate(
assetHold:"SHIB"
){
assetHold
assetReward
dailyRewardPerUnit
rewardYearlyEstimatePct
ordering
enteredRewardYearly
rewardType
}
}`;
export const ManageStaking_getUserRewardRateGrid_0 = `query {
ManageStaking_getUserRewardRateGrid(
startRow: 0
endRow: 20
sorting: [ { colId: assetHold, sort: ASC } ]

) {
nodes{
assetHold
assetReward
dailyRewardPerUnit
rewardYearlyEstimatePct
ordering
enteredRewardYearly
rewardType
}
}
}`;
export const ManageCrypto_getDepositGlobalGrid_0 = `query {
ManageCrypto_getDepositGlobalGrid(
startRow: 0
endRow: 20
sorting: [ { colId: userId, sort: ASC } ]

) {
nodes{
userId
memo
service
timestamp
status
address
txid
amount
amountEur
fee
updated
chain
}
}
}`;
export const ManageCrypto_getDepositGlobalGrid_1 = `query {
ManageCrypto_getDepositGlobalGrid(
startRow: 0
endRow: 20
sorting: [ { colId: userId, sort: ASC } ]

cryptoAsset:XLM
) {
nodes{
userId
memo
service
timestamp
status
address
txid
amount
amountEur
fee
updated
chain
}
}
}`;
export const ManageMetaData_test_getUnclaimedDeposit_0 = `query {
ManageMetaData_test_getUnclaimedDeposit(
depositByChainId:"5-XLM"
){
status
verifier1
verifier2
guid
cryptoAsset
id
depositByChainId
createdAt
updatedAt
}
}`;
export const ManageMetaData_test_getUnclaimedDepositGrid_0 = `query {
ManageMetaData_test_getUnclaimedDepositGrid(
startRow: 0
endRow: 20
sorting: [ { colId: status, sort: ASC } ]

) {
nodes{
status
verifier1
verifier2
guid
cryptoAsset
id
depositByChainId
createdAt
updatedAt
}
}
}`;
export const ManageCrypto_getCryptoWithdrawalStuckGrid_0 = `query {
ManageCrypto_getCryptoWithdrawalStuckGrid(
startRow: 0
endRow: 20
sorting: [ { colId: userId, sort: ASC } ]

) {
nodes{
userId
amount
amountEur
fee
id
cryptoAsset
refId
processStatus
service
created
updated
status
token
recipient
address
txid
paymentId
chain
}
}
}`;
export const ManageMetaData_getStuckWithdrawalMetaGrid_0 = `query {
ManageMetaData_getStuckWithdrawalMetaGrid(
startRow: 0
endRow: 20
sorting: [ { colId: status, sort: ASC } ]

) {
nodes{
status
verifier1
verifier2
guid
cryptoAsset
newStuckWithdrawalStatus
txid
prevStuckWithdrawalStatus
requestId
cryptoStuckId
createdAt
updatedAt
}
}
}`;
