import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import genericAuth from "../../../services/authentication/genericshelpersauth";
import "./styles.css";
import moment from 'moment';

class SuperEditor extends React.Component {

  constructor(props) {
    super(props);    
    this.useremail = this.props.userEmail;
    this.entrytitle = `${this.props.userFirstName}'s log entry`;
    this.entrydate = null;
    this.token = localStorage.getItem("jwt_diegomary");
    this.state = { content : this.props.initialContent };
    
  }

  componentDidMount() {
    this.refs.editorjournal.style.height="0";
    this.refs.editorjournal.style.visibility="hidden";   
  }

  handleEditorChange = (content) => { 
    this.setState({ content });  
   
  }

  // ucs-2 string to base64 encoded ascii
   utoa = (str) => {
    return window.btoa(unescape(encodeURIComponent(str)));
}

// base64 encoded ascii to ucs-2 string
  atou = (str) => {
      return decodeURIComponent(escape(window.atob(str)));
  }

  handleSave = () => {
   
    this.entrydate = moment().format("dddd Do of MMMM YYYY - HH:mm");

    let encodedEntry = this.utoa(this.state.content);    
    genericAuth().addJournalEntry(this.token, this.useremail, this.entrytitle, encodedEntry, this.entrydate).then(response => {

      if (response.status >= 400) {		
        console.log(response.status);			
      }
      return response.json();
      })
      .then(result => {
        this.setState({ content: "" });
        this.refs.editorjournal.style.visibility="hidden"; 
        this.refs.editorjournal.style.height="0";
        this.refs.buttonplus.style.transform = "rotate(0deg)";
        this.refs.plusbuttonlabel.innerHTML = "Add journal entry"
        this.props.callbackUpdate();
    }); 

   }

   openEditor = () => {
        
    genericAuth().authCheck()
    .then(response => {
        if (response.status >= 400) { 
          console.log(response.status);                   
        }    
        return response.json();
    })              
    .then(data => {
        
    });





   
    let editor = this.refs.editorjournal;
    let buttonplus = this.refs.buttonplus;

    if (editor.style.visibility === "hidden") {
      editor.style.visibility="visible";
      editor.style.height="initial";
      buttonplus.style.transform = "rotate(45deg)";
      this.refs.plusbuttonlabel.innerHTML = "Cancel"
      return;
    }
    
    editor.style.visibility="hidden";
    editor.style.height="0";
    buttonplus.style.transform = "rotate(0deg)";
    this.refs.plusbuttonlabel.innerHTML = "Add journal entry"
   
   }

  
  render() {
    return (
      <div className = "html-editor-container">
            <div ref="plusentry" className="plus-entry-div">
              <button ref="buttonplus" onClick={this.openEditor}></button>
              <p ref="plusbuttonlabel">Add journal entry</p>
            </div>    
            
            <div ref = "editorjournal" >
            <Editor value = {this.state.content} apiKey ="zi3r5wx6obgywia01clchubtxlib0rsky7hwaf6oqng97p5r"
              initialValue = ""
              id = "tiny_dm"  
              init={{
                browser_spellcheck : true,                             
                menubar: true,
                height: 400,
                theme: 'modern',
                plugins: 'save visualblocks emoticons hr wordcount print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount  imagetools  colorpicker textpattern help',
                toolbar: 'save | tools | formats | table |pagebreak| image | undo redo | insertdatetime |  media | emoticons | code | formatselect | bold italic strikethrough underline forecolor backcolor | link | alignleft aligncenter alignright alignjustify  | numlist bullist outdent indent  | removeformat',
                //menubar: "tools",
                // plugins: [
                //   'a11ychecker emoticons advlist autolink lists link image charmap print preview anchor textcolor,spellchecker',
                //   'searchreplace visualblocks code fullscreen imagetools',
                //   'insertdatetime media table contextmenu paste code help wordcount','save'
                // ],
                //toolbar: 'save | insert | undo redo | spellchecker |  formatselect |image imagetools | bold italic backcolor  | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help',
              
                image_advtab: true,
                save_onsavecallback: this.handleSave,
                templates: [
                  { title: 'Test template 1', content: 'Test 1' },
                  { title: 'Test template 2', content: 'Test 2' }
                ],
                content_css: ['tiny_style_override.css'],
               
              }}
              onEditorChange = {this.handleEditorChange}            
            />      
            </div>              
      </div>
    );
  }
}

export default SuperEditor;