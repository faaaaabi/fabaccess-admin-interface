import {createMuiTheme} from '@material-ui/core/styles';
import {ThemeOptions} from "@material-ui/core/styles/createMuiTheme";
import {red} from "@material-ui/core/colors";

const themeOptions = {
    palette: {
        primary: {main: '#59804E'},
        secondary: {main: '#1F331A'},
        error: red,
        // Used by `getContrastText()` to maximize the contrast between the background and
        // the text.
        contrastThreshold: 3,
        // Used to shift a color's luminance by approximately
        // two indexes within its tonal palette.
        // E.g., shift from Red 500 to Red 300 or Red 700.
        tonalOffset: 0.2,
    },
    status: {
        danger: 'orange',
    },
};

const fabbAccessTheme = createMuiTheme(themeOptions as ThemeOptions);

export default fabbAccessTheme;