import { style } from "@vanilla-extract/css";

export const StyledItemInput = style({
    position: 'absolute',
    bottom: '1em',
    left: '1em',

    display: 'flex',
    flexDirection: 'row'
});

export const StyledTextarea = style({
    width: '30em',
    height: '10em',
    border: '1px solid #ccc',
    borderRadius: '0.5em',
    padding: '1em',
});

export const StyledApplyButton = style({
    border: '1px solid #ccc',
    borderRadius: '0.5em',
    padding: '1em',
});
