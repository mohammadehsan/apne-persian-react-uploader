import React, {useState} from "react"
import PropTypes from 'prop-types';
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import {
    Table, TableBody, TableCell, TableHead, TablePagination,
    CircularProgress, TableRow, IconButton, Button,
    LinearProgress, Badge, withStyles, Tooltip
} from '@material-ui/core';
import Icon from "@mdi/react";
import {mdiFileExcel, mdiFilePdf, mdiFileWord} from "@mdi/js";
import {Check, CloudUpload, CloudUploadOutlined, Delete} from '@material-ui/icons';
import Dropzone from "react-dropzone";
import {styles} from './assets/style';
import axios from "axios";


const StyledTableCell = withStyles(theme => ({
    head: {
        backgroundColor: theme.palette.background.default,
        color: "#c7c7c7",
    },
    body: {
        fontSize: 11,
    },
}))(TableCell);

const StyledTableRow = withStyles(theme => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

export const theme = createMuiTheme({
    direction: 'rtl',
    typography: {
        fontFamily: [
            'tahoma',
            'sans-serif'
        ].join(','),
        useNextVariants: true,
    },
});

function Uploader(props) {


    const [state, setState] = useState({
        files: [],
        completedIndexes: [],
        completed: 0,
        total: 0,
        page: 0,
        rowsPerPage: 5,
        processIndex: null,
        done: false
    });

    function handleChangePage(event, newPage) {
        setState({page: newPage});
    }

    function handleChangeRowsPerPage(event) {
        setState({rowsPerPage: +event.target.value});
    }

    function onDrop(files) {
        let totalSize = 0;
        files.map((file) => {
            totalSize += file.size;
        });
        setState(prevState => {
            return {...prevState, files: files, total: totalSize}
        });
        if (props.autoUpload) {
            uploaderHandler(null);
        }
        if (props.returnItems !== undefined) {
            return props.returnItems(state.files);
        }
    }

    function uploaderHandler(index) {
        setState(prevState => {
            return {...prevState, processIndex: index}
        });
        var bodyFormData = new FormData();
        if (index === null) {
            state.files.map((file) => {
                bodyFormData.append('files', file);
            });
        } else {
            bodyFormData.append('files', state.files[index]);
        }
        axios.post(props.uploadUrl, bodyFormData, {
            onUploadProgress: (progressEvent) => {
                var percentCompleted = Math.round((progressEvent.loaded * 100) / state.totalSize);
                setState(prevState => {
                    return {...prevState, completed: percentCompleted}
                });

            },
        }).then(respons => {
            var cmpList = state.completedIndexes;
            if (state.files === 1) {
                if (!cmpList.find(item => item.name === respons.data[0])) {
                    cmpList.push({name: respons.data[0], code: respons.data[1]});
                }
            } else {
                respons.data.map((ary) => {
                    if (!cmpList.find(item => item.name === ary[0])) {
                        cmpList.push({name: ary[0], code: ary[1]});
                    }
                });
            }
            props.showAlert ? alert('عملیات بارگزاری باموفقیت انجام شد.') : null;
            setState(prevState => {
                return {...prevState, done: true, completedIndexes: cmpList}
            });
            return props.responseStatus ? props.responseStatus(true) : null;
        }).catch(errors => {
            props.showAlert ? alert('خطا در عملیات بارگزاری !') : null;
            return props.responseStatus ? props.responseStatus(false) : errors;
        });
    }


    function removeAll() {
        setState({
            files: [], completed: 0, completedIndexes: [],
            total: 0, page: 0, rowsPerPage: 5, processIndex: null, done: false
        });
        props.showAlert ? alert('همه موارد حذف شد.') : null;
    }

    function removeItem(name) {
        let array, indx, cmpList;
        array = state.files;
        indx = array.findIndex(item => item.name === name);
        if (indx !== -1) {
            array.splice(indx, 1);
        }

        cmpList = state.completedIndexes;
        indx = cmpList.findIndex(item => item.name === name);
        if (indx !== -1) {
            cmpList.splice(indx, 1)
        }
        /*
            if (indx!==-1) so that your file uploaded, you can
            call server side method in this section
            to remove file from server repository
         */
        setState(prevState => {
            return {...prevState, files: array, completedIndexes: cmpList}
        });
        props.showAlert ? alert("رکورد انتخابی حذف شد.") : null;
    }

    const {classes, minSize, maxSize, multiple, autoUpload, hideButtons, translate} = props;
    const {page, rowsPerPage, files, completed, processIndex, completedIndexes} = state;
    const styleDropzone = {
        dragActive: {margin: 12, borderRadius: 4, backgroundColor: "#f2fafd", border: "1px solid #00a5ff"},
        dragDeactive: {margin: 12, borderRadius: 4, border: "1px dashed #9c9c9c"}
    };

    return (
        <MuiThemeProvider theme={theme}>
            <div style={{direction: 'rtl'}}>
                <Dropzone onDrop={onDrop} minSize={minSize} maxSize={maxSize} multiple={multiple}>
                    {({getRootProps, getInputProps, isDragActive}) => {
                        return (
                            <div className="container">
                                <div {...getRootProps({className: 'dropzone'})}
                                     style={isDragActive ? styleDropzone.dragActive : styleDropzone.dragDeactive}>
                                    <input {...getInputProps()} />
                                    {
                                        isDragActive ?
                                            <p style={{
                                                textAlign: 'center',
                                                fontSize: 11,
                                                color: '#9c9c9c'
                                            }}>
                                                لطفا فایل را رها کنید</p> :
                                            <p style={{
                                                textAlign: 'center',
                                                fontSize: 11,
                                                color: '#9c9c9c'
                                            }}>
                                                <span> برای انتخاب فایل کلیک کنید.</span>
                                                <CloudUpload style={{marginTop: 6, fontSize: 24}}/></p>
                                    }
                                </div>

                            </div>
                        );
                    }}
                </Dropzone>
                <aside style={{padding: 12}}>
                    {processIndex === null ?
                        <LinearProgress variant="determinate" value={completed}/> : null}
                    <Table>
                        <TableHead>
                            <TableRow>
                                <StyledTableCell align="center">ردیف</StyledTableCell>
                                <StyledTableCell align="center">نمایه</StyledTableCell>
                                <StyledTableCell align="center">نام فایل</StyledTableCell>
                                <StyledTableCell align="center">حجم فایل</StyledTableCell>
                                <StyledTableCell align="center"> </StyledTableCell>
                                <StyledTableCell align="center">عملیات</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {files.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((file, index) => (
                                <StyledTableRow key={index}>
                                    <StyledTableCell align="center">
                                        {index + 1}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        {file.type.includes("image") ?
                                            <img width="36" height="36"
                                                 src={URL.createObjectURL(file)}/> :
                                            (file.type.includes("application/pdf") ?
                                                <Icon size={1} path={mdiFilePdf} color={"#ee453e"}/> :
                                                (file.type.includes(".document") ?
                                                    <Icon size={1} path={mdiFileWord} color={"#009ce6"}/> :
                                                    (file.type.includes(".sheet") ?
                                                        <Icon size={1} path={mdiFileExcel}
                                                              color={"#7fd41b"}/> : file.type)))}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">{file.path}</StyledTableCell>
                                    <StyledTableCell
                                        align="center">{Math.round(file.size / 1024).toFixed(0)}کیلوبایت</StyledTableCell>

                                    <StyledTableCell align="center">
                                        {processIndex === index ?
                                            <CircularProgress color="primary" variant="determinate"
                                                              value={completed}/> : null}
                                    </StyledTableCell>
                                    <StyledTableCell align="center">

                                        <IconButton onClick={() => {
                                            removeItem(file.name)
                                        }}>
                                            <Tooltip title="حذف آیتم" placement="top">
                                                <Delete className={classes.textError}/>
                                            </Tooltip>
                                        </IconButton>
                                        {(autoUpload || hideButtons) ? completedIndexes.find(item => item.name === file.name) ?
                                            <Check className={classes.textSuccess}/> : null :
                                            (completedIndexes.find(item => item.name === file.name) ?
                                                <Check className={classes.textSuccess}/>
                                                : <IconButton onClick={() => {
                                                    uploaderHandler(index)
                                                }}>
                                                    <Tooltip title="بارگزاری آیتم"
                                                             placement="top">
                                                        <CloudUploadOutlined className={classes.textInfo}/>
                                                    </Tooltip>
                                                </IconButton>)}
                                    </StyledTableCell>
                                </StyledTableRow>

                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={files.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            'aria-label': 'صفحه قبلی',
                        }}
                        nextIconButtonProps={{
                            'aria-label': 'صفحه بعدی',
                        }}
                        labelRowsPerPage="تعداد رکورد در صفحه:"
                        labelDisplayedRows={paginationInfo => {
                            return "نمایش رکورد" + paginationInfo.from + "تا" + paginationInfo.to + "از" + paginationInfo.count + "رکورد"


                        }}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />

                    <div className={classes.formButtonSection}>
                        {(autoUpload || hideButtons) ? null :
                            <Badge color="primary" badgeContent={files.length - completedIndexes.length}
                                   className={classes.margin}>
                                <Button disabled={(files.length === completedIndexes.length)}
                                        color="primary" onClick={() => {
                                    uploaderHandler(null)
                                }} variant="outlined" size="medium"
                                        style={{padding: "5px 8px", margin: 0}}><CloudUploadOutlined
                                    style={{margin: '0 4px'}}/>بارگزاری همه</Button>
                            </Badge>}
                        <Badge color="primary" badgeContent={state.files.length}
                               className={classes.margin}>
                            <Button disabled={(files.length === 0)}
                                    className={classes.errorButtonOutLine} onClick={removeAll}
                                    variant="outlined"
                                    size="medium"><Delete
                                style={{margin: '0 4px'}}/>حذف همه</Button>
                        </Badge>
                    </div>

                </aside>
            </div>
        </MuiThemeProvider>
    );
}


Uploader.contextTypes = {
    translate: PropTypes.func
};

Uploader.propTypes = {
    classes: PropTypes.object.isRequired,
    multiple: PropTypes.bool,
    minSize: PropTypes.number,
    maxSize: PropTypes.number,
    autoUpload: PropTypes.bool,
    hideButtons: PropTypes.bool,
    returnItems: PropTypes.func,
    responseStatus: PropTypes.func,
    uploadUrl: PropTypes.string.isRequired,
    showAlert: PropTypes.bool
};

export default withStyles(styles)(Uploader)
