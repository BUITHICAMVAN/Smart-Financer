import moment from 'moment'
import React from 'react'

export const getDueTypeName = (dueTypeId, dueTypes) => {
    if (typeof dueTypes !== 'object') return 'Unknown'
    const dueType = Object.values(dueTypes).find(type => type.due_type_id === dueTypeId)
    return dueType ? dueType.due_type_name : 'Unknown'
}

export const getDueStatusName = (dueStatusId, dueStatuses) => {
    if (typeof dueStatuses !== 'object') return 'Unknown'
    const dueStatus = Object.values(dueStatuses).find(status => status.due_status_id === dueStatusId)
    return dueStatus ? dueStatus.due_status_name : 'Unknown'
}

export const getDueStatusIcon = (dueStatusId, dueStatuses) => {
    if (typeof dueStatuses !== 'object') return null
    const dueStatus = Object.values(dueStatuses).find(status => status.due_status_id === dueStatusId)

    if (!dueStatus) return null

    const isPending = dueStatus.due_status_name === 'pending'
    const color = isPending ? 'yellow' : 'green'
    return (
        <span style={{ color }}>
            <i className="fa-regular fa-circle-check" title={dueStatus.due_status_name}></i>
        </span>
    )
}

export const getDueTypeWithColor = (dueTypeId, dueTypes) => {
    if (typeof dueTypes !== 'object') return null
    const dueType = Object.values(dueTypes).find(type => type.due_type_id === dueTypeId)

    if (!dueType) return null

    const color = dueType.due_type_name === 'payable' ? 'red' : 'green'
    return (
        <span style={{ color }}>
            {dueType.due_type_name}
        </span>
    )
}

export const getDueDateStatus = (dueDate) => {
    const isPastDue = moment(dueDate).isBefore(moment(), 'day');
    return isPastDue ? <span style={{ color: 'red' }}>!</span> : null;
};