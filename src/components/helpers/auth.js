// Check if token is valid
export function isAuthed(){
    let token = localStorage.getItem('wca');
    if(token !== null && token !== undefined){
        return true;
    } else {
        return false;
    }
}

/** 
 * SPDX-License-Identifier: (EUPL-1.2)
 * Copyright © 2019 Werbeagentur Christian Aichner
 */
