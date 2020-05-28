import React from 'react';
import Paper from "@material-ui/core/Paper";
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles((theme) => ({
    paper: {
        width: "10vw",
        height: "10vw",
        fontSize: "10vw",
        
        transform: "rotate(" + parseInt(Math.random()*20-10) + "deg)",
    },
    noteColor1: { backgroundColor: "#E1CEC9", },
    noteColor2: { backgroundColor: "#EBE6E5", },
    noteColor3: { backgroundColor: "#DFD8DC", },
    noteColor4: { backgroundColor: "#D2C1CE", },
    noteColor5: { backgroundColor: "#B4BAD4", },
    noteColor6: { backgroundColor: "#D4CFBD", },
}));

function Note(props) {
    const classes = useStyles();
    return (
            <Paper
                elevation={3}
                square={true}
                className={[classes.paper, classes["noteColor" + props.color] ]}
                >
                {props.contents}
            </Paper>
    );
}

export default Note;
