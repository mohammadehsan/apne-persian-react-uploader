
export const styles = theme => ({
    backWarning: {
        backgroundColor: "#ffba1d"
    },
    backSuccess: {
        backgroundColor: "#7fd41b",
        color: "#fff"
    },
    backInfo: {
        backgroundColor: "#009ce6"
    },
    backError: {
        backgroundColor: "#ee453e"
    },
    textWarning: {
        color: "#ffba1d"
    },
    textSuccess: {
        color: "#7fd41b",
    },
    textInfo: {
        color: "#009ce6"
    },
    textError: {
        color: "#ee453e"
    },
    direction: {
        direction: 'ltr'
    },
    root: {
        display: 'flex',
    },
    margin: {
        margin: theme.spacing.unit,
    },
    errorButtonOutLine: {
        padding: "5px 8px",
        margin: 0,
        border: '1px solid #ee453e',
        transition: 'background 0s',
        color: "#ee453e",
        '&:hover': {
            backgroundSize: '100%',
            transition: 'background 0.8s',
            backgroundColor: "#f9dad9",
        },
    },
    formButtonSection: {
        textAlign: 'right',
        padding: 8,
        backgroundColor: "#fafafa"
    },



});
