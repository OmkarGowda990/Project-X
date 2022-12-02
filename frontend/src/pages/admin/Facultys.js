import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown"
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useDispatch, useSelector } from "react-redux";
import { addFacultyServer, deleteFacultyServer, editFacultyServer, getFacultyServer, } from "../../reduxSlices/FacultySlice";
import { useNavigate } from "react-router-dom";

const Facultys = () => {
  let emptyFaculty = {
    name: "",
    institute_id: "",
    department: "",
    mentees: [],
  };

  const navigate = useNavigate()

  const dispatch = useDispatch()
  const reduxFaculty = useSelector(state => state.faculty) 
  const toast = useRef(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedMentees, setSelectedMentees] = useState(null);
  const [facultyDialog, setFacultyDialog] = useState(false);
  const [viewMenteesDialog, setViewMenteesDialog] = useState(false);
  const [addFacultyDialog, setAddFacultyDialog] = useState(false);
  const [facultyName, setFacultyName] = useState("");
  const [facultyId, setFacultyId] = useState("");
  const [facultyDept, setFacultyDept] = useState("");
  const [deleteFacultyDialog, setDeleteFacultyDialog] = useState(false);
  const [faculty, setFaculty] = useState(emptyFaculty);
  const [facultyInfoDialog,setFacultyInfoDialog] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedDepartment, setSelectedDepartment] = useState({
    label:'DSAI'
  })

  if(reduxFaculty.length === 0){
    dispatch(getFacultyServer())
  }
  
  console.log(reduxFaculty)
  const departments = [
    {
      label:"CSE",
    },
    {
      label:"DSAI"
    },
    {
      label:"ECE"
    }

  ] 

  // const facultys = [...reduxfaculty];

  const actionBodyTemplate = (rowData) => {
    return (
      <>
        <Button
          icon="pi pi-users"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => viewMentees()}
        />
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning mr-2"
          onClick={() => editFaculty(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => confirmFacultyDelete(rowData)}
        />
      </>
    );
  };

  const viewMentees = () => {
    setViewMenteesDialog(true);
  };
  const addFaculty = () => {
    setAddFacultyDialog(true);
  };

  const editFaculty = (data)=>{
    setFaculty(data);
    setFacultyInfoDialog(true);
  }

  const confirmFacultyDelete = (data) => {
    setFaculty(data);
    setDeleteFacultyDialog(true);
  };

  const onDepartmentChange = (e)=>{
    setSelectedDepartment(e.target.value)
  }

  const hideDeleteProductDialog = () => {
    setDeleteFacultyDialog(false);
  };

  const hideViewMenteesDialog = () => {
    setViewMenteesDialog(false);
  };

  const hideFacultyInfoDialog = ()=>{
    setFacultyInfoDialog(false)
  };

  const hideAddFacultyDialog = () => {
    setAddFacultyDialog(false);
  };


  const onAddFaculty = async() => {
    await dispatch(addFacultyServer({name: facultyName, email: facultyId, department: facultyDept}))
    setAddFacultyDialog(false);
  }

  const onUpdateFaculty = async() => {
    const updatedFaculty = {...faculty, department: selectedDepartment.label}
    await dispatch(editFacultyServer(updatedFaculty))
    setFacultyInfoDialog(false)
  }

  const ondeleteFaculty = async() => {
    setDeleteFacultyDialog(false);
    await dispatch(deleteFacultyServer(faculty))
  };

  const viewMenteesDialogFooter = (
    <>
      <Button label="Add Mentee" className="p-button-text" />
    </>
  );

  const facultyInfoDialogFooter = (
    <>
      <Button label="Update" className="p-button-text" onClick={onUpdateFaculty}/>
    </>
  )

  const addFacultyDialogFooter = (
    <>
      <Button label="Add Faculty" className="p-button-text" onClick={onAddFaculty}/>
    </>
  );


  const deleteFacultyDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={ondeleteFaculty}
      />
    </React.Fragment>
  );

  const paginatorLeft = (
    <Button type="button" icon="pi pi-refresh" className="p-button-text" />
  );
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  );

  return (
    <>
      <div className="border-round-lg ml-2 w-full">
        <div className="p-3 min-h-screen border-round-lg">
          <div>
            <h1>View Faculty</h1>
            <DataTable
              value={reduxFaculty}
              paginator
              responsiveLayout="scroll"
              paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
              rows={10}
              rowsPerPageOptions={[10, 20, 50]}
              paginatorLeft={paginatorLeft}
              paginatorRight={paginatorRight}
              selection={selectedFaculty}
              onSelectionChange={(e) => setSelectedFaculty(e.value)}
            >
              <Column
                selectionMode="multiple"
                headerStyle={{ width: "3rem" }}
                exportable={false}
              ></Column>
              <Column
                field="name"
                header="Name"
                style={{ minWidth: "8rem" }}
              ></Column>
              <Column
                field="email"
                header="Institute ID"
                style={{ minWidth: "8rem" }}
              ></Column>
              <Column
                field="department"
                header="Department"
                style={{ minidth: "8rem" }}
              ></Column>
              <Column
                field="mentees"
                header="No. of Mentees"
                style={{ width: "20%" }}
              ></Column>
              <Column
                header="Actions"
                body={actionBodyTemplate}
                exportable={false}
                style={{ minWidth: "8rem" }}
              ></Column>
            </DataTable>
            <Button
              label="Add Faculty"
              className="mt-3"
              onClick={(e) => addFaculty()}
            />
          </div>
        </div>
      </div>

      <Dialog
        visible={deleteFacultyDialog}
        style={{ width: "450px" }}
        header="Confirm"
        modal
        footer={deleteFacultyDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {faculty && (
            <span>
              Are you sure you want to delete <b>{faculty.name}</b>?
            </span>
          )}
        </div>
      </Dialog>


      <Dialog
        visible={viewMenteesDialog}
        style={{ width: "450px" }}
        header="View Mentees"
        footer={viewMenteesDialogFooter}
        model
        onHide={hideViewMenteesDialog}
      >
        <DataTable
          selection={selectedMentees}
          onSelectionChange={(e) => setSelectedMentees(e.value)}
        >
          <Column selectionMode="multiple"></Column>
          <Column field="" header="Name"></Column>
          <Column field="" header="Institute ID"></Column>
          <Column field="" header="Department"></Column>
        </DataTable>
      </Dialog>


      <Dialog
        visible={addFacultyDialog}
        style={{ width: "450px" }}
        header="Add Faculty"
        model
        footer={addFacultyDialogFooter}
        onHide={hideAddFacultyDialog}
      >
        <div className="card">
          <div className="flex flex-column">
            <label htmlFor="facultyName">Name</label>
            <InputText
              id="facultyName"
              value={facultyName}
              onChange={(e) => setFacultyName(e.target.value)}
            />
          </div>
          <div className="flex flex-column mt-4">
            <label htmlFor="facultyId">Institute Id(Mail)</label>
            <InputText
              id="facultyId"
              value={facultyId}
              onChange={(e) => setFacultyId(e.target.value)}
            />
          </div>
          <div className="flex flex-column mt-4">
            <label htmlFor="facultyDept">Department</label>
            <InputText
              id="facultyDept"
              value={facultyDept}
              onChange={(e) => setFacultyDept(e.target.value)}
            />
          </div>
        </div>
      </Dialog>


      <Dialog
        visible={facultyInfoDialog}
        onHide={hideFacultyInfoDialog}
        header = "Edit Profile"
        style={{width:"450px"}}
        modal
        className="p-fluid"
        footer={facultyInfoDialogFooter}
      >
        <div className="field">
          <label htmlFor="name">Name</label>
          <InputText 
            id="name"
            value={faculty.name}
            required
            autoFocus
            className={classNames({"p-invalid":submitted && !faculty.name})}
          />
        </div>
        <div className="field">
          <label htmlFor="institute_id">Institute Mail Id</label>
          <InputText 
            id="institute_id"
            value={faculty.email}
            required
            autoFocus
            className={classNames({"p-invalid":submitted && !faculty.institute_id})}
          />
        </div>
        <div className="field">
          <label htmlFor="department">Department</label>
          <Dropdown 
            value={selectedDepartment}
            options = {departments}
            placeholder="Select a department"
            required
            onChange={onDepartmentChange}
          />
        </div>
      </Dialog>

    </>
  );
};

export default Facultys;
