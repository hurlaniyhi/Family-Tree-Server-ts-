export const ResponseCode = {
    SUCCESS: '00',
    NO_RECORD: '45',
    FOUND_RECORD: '59',
    PROCESS_FAILED: '25',
    CATCH_ERROR: '101',
    BAD_REQUEST: '400',
    NOT_FOUND: '404',
    INVALID_USER: '99',
    LARGE_FILE: '403',

}

export const ResponseDescription = {
    SUCCESS: "SUCCESS",
    CATCH_ERROR: "Something went wrong",
    NO_RECORD: "No record found",
    PROCESS_FAILED: "Process could not completed",
    FOUND_RECORD: "Record already exist",
    BAD_REQUEST: "Bad request. Kindly check your request parameters",
    NOT_FOUND: "Route could not be found",
    INVALID_USER: "Invalid user",
    LARGE_FILE: "Profile picture is too large"
}

export const constant = {
    EMAIL_FORGET_PASSWORD: "2",
    EMAIL_ONBOARDING: '1',
    SEARCHFAMILY_PHONENUMBER: "1",
    SEARCHFAMILY_FAMILYDETAILS: "2",
    SEARCHFAMILY_NAME_HOMETOWN: "3" ,
    SEARCHFAMILY_USERNAME: "4"
}
