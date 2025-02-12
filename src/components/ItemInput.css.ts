import { style } from "@vanilla-extract/css";

export const StyledItemInput = style({
    position: 'absolute',
    bottom: '1em',
    left: '1em',

    display: 'flex',
    flexDirection: 'row'
});

export const StyledTextarea = style({
    width: '24em',
    height: '8em',
    border: '.1em solid #ccc',
    borderRadius: '0.5em',
    padding: '1em',
});

export const StyledApplyButton = style({
    border: '.1em solid #ccc',
    borderRadius: '0.5em',
    padding: '1em',
});
