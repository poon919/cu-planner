import React from 'react'
import { makeStyles, darken, lighten } from '@material-ui/core/styles'
import Hidden from '@material-ui/core/Hidden'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import MenuItem from '@material-ui/core/MenuItem'
import IconButton from '@material-ui/core/IconButton'
import Collapse from '@material-ui/core/Collapse'
import CheckIcon from '@material-ui/icons/Check'
import ClearIcon from '@material-ui/icons/Clear'
import LaunchIcon from '@material-ui/icons/Launch'

import { CourseFilter } from '../../models'
import CourseFilterForm, { useForm } from '../../components/forms/CourseFilterForm'

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: '200px',
    },
  },
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'flex-end',
  },
  courseSelect: {
    flex: '1 1 auto',
  },
  filter: {
    '& .MuiInputLabel-root': {
      padding: 'inherit',
    },
  },
  previewContainer: {
    marginTop: theme.spacing(1),
  },
  previewSections: {
    display: 'flex',
    alignItems: 'center',
    flex: '1 1 auto',
    padding: theme.spacing(0, 1),
    // Take some properties from Alert component with warning severity
    borderRadius: theme.shape.borderRadius,
    color: darken(theme.palette.warning.main, 0.6),
    backgroundColor: lighten(theme.palette.warning.main, 0.9),
  },
  applyBtn: {
    color: theme.palette.success.main,
  },
  rejectBtn: {
    color: theme.palette.error.main,
  },
}))

export interface SelectItem {
  key: React.Key
  value: string,
  text: string,
}

export interface FilterBoxProps {
  items: SelectItem[]
  selected: string
  filter: CourseFilter
  preview?: CourseFilter
  onSelectCourse: (code: string) => void
  onFilterChange: (code: string, filter: CourseFilter) => void
  onApplyPreview: () => void
  onRejectPreview: () => void
  onViewCourse: (code: string) => void
}

const FilterBox = ({
  items,
  selected,
  filter,
  preview,
  onSelectCourse,
  onFilterChange,
  onApplyPreview,
  onRejectPreview,
  onViewCourse,
}: FilterBoxProps) => {
  const { form } = useForm({
    values: filter,
    onChange: (e, values) => {
      const { name, value } = e.target
      if (preview) {
        onRejectPreview()
      }
      onFilterChange(selected, { ...values, [name]: value })
    },
  })

  const handleSelectCourse = (code: string) => {
    if (preview) {
      onRejectPreview()
    }
    onSelectCourse(code)
  }

  const classes = useStyles()

  return (
    <div>
      <Grid container alignItems="flex-end" wrap="nowrap" spacing={1} className={classes.filter}>
        <Grid container item xs={4} sm={2} wrap="nowrap">
          <TextField
            select
            label="Course"
            value={selected}
            onChange={(e) => handleSelectCourse(e.target.value)}
            className={classes.courseSelect}
            SelectProps={{ MenuProps }}
            disabled={items.length === 0}
          >
            {items.map(({ key, value, text }) => (
              <MenuItem key={key} value={value}>{text}</MenuItem>
            ))}
          </TextField>
          <Hidden lgUp>
            <IconButton
              aria-label="view-course"
              title="View course"
              onClick={() => onViewCourse(selected)}
              disabled={!selected}
            >
              <LaunchIcon />
            </IconButton>
          </Hidden>
        </Grid>
        <Grid item xs={8} sm={5}>
          <CourseFilterForm.SectionField
            form={form}
            disabled={!selected}
          />
        </Grid>
        <Hidden xsDown>
          <Grid item sm={5}>
            <CourseFilterForm.KeywordField
              form={form}
              disabled={!selected}
            />
          </Grid>
        </Hidden>
      </Grid>
      <Collapse in={!!preview}>
        <Grid container wrap="nowrap">
          <Grid item xs={4} sm={2} />
          <Grid container item xs={8} sm={5} wrap="nowrap">
            <Grid item className={classes.previewSections}>
              <Typography variant="caption">
                {preview?.section}
              </Typography>
            </Grid>
            <IconButton
              size="small"
              aria-label="apply-filters"
              title="Apply filters"
              className={classes.applyBtn}
              onClick={onApplyPreview}
              disabled={!preview}
            >
              <CheckIcon />
            </IconButton>
            <IconButton
              size="small"
              aria-label="reject-filters"
              title="Reject filters"
              className={classes.rejectBtn}
              onClick={onRejectPreview}
              disabled={!preview}
            >
              <ClearIcon />
            </IconButton>
          </Grid>
        </Grid>
      </Collapse>
    </div>
  )
}

FilterBox.defaultProps = {
  filter: { section: '', keyword: '' },
  selected: '',
}

export default FilterBox
