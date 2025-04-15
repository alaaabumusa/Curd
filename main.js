const name = document.querySelector("#courseName"); 
    const category = document.querySelector("#courseCategory");
    const price = document.querySelector("#coursePrice");
    const description = document.querySelector("#courseDescription");
    const capacity = document.querySelector("#courseCapacity");
    const addBtn = document.querySelector("#click");
    const deleteBtn = document.querySelector("#deleteBtn");
    const invalidName = document.querySelector(".invalid-name");
    const invalidCategory = document.querySelector(".invalid-category");
    const invalidPrice = document.querySelector(".invalid-price");
    const invalidDescription = document.querySelector(".invalid-description");
    const invalidCapacity = document.querySelector(".invalid-capacity");
    const search = document.querySelector("#search");

    let courses = [];
    let editIndex = null;

    if(localStorage.getItem("courses")){
      courses = JSON.parse(localStorage.getItem("courses"));
      displayCourses();
    }

    addBtn.addEventListener("click", (e) => {
      e.preventDefault();
      let isValid = true;

      const namePattern = /^[A-Z][a-z]{2,20}[0-9]{0,2}$/;
      if(!namePattern.test(name.value)){
        invalidName.innerHTML = "Course name must start with a capital letter and contain at least 3 and at most 10 lowercase letters.";
        name.classList.add("is-invalid");
        isValid = false;
      } else {
        invalidName.innerHTML = "";
        name.classList.remove("is-invalid");
        name.classList.add("is-valid");
      }

      const categoryPattern = /^[A-Z][a-z]{2,20}$/;
      if(!categoryPattern.test(category.value)){
        invalidCategory.innerHTML = "Category must start with a capital letter and contain at least 3 and at most 5 lowercase letters.";
        category.classList.add("is-invalid");
        isValid = false;
      } else {
        invalidCategory.innerHTML = "";
        category.classList.remove("is-invalid");
        category.classList.add("is-valid");
      }

      const pricePattern = /^\d+(\.\d{1,2})?$/;
      if(!pricePattern.test(price.value)){
        invalidPrice.innerHTML = "Price must be a number with up to two decimal places.";
        price.classList.add("is-invalid");
        isValid = false;
      } else {
        invalidPrice.innerHTML = "";
        price.classList.remove("is-invalid");
        price.classList.add("is-valid");
      }

      const descriptionPattern = /^[A-Za-z0-9.,!? ]{10,}$/;
      if(!descriptionPattern.test(description.value)){
        invalidDescription.innerHTML = "Description must contain at least 10 characters.";
        description.classList.add("is-invalid");
        isValid = false;
      } else {
        invalidDescription.innerHTML = "";
        description.classList.remove("is-invalid");
        description.classList.add("is-valid");
      }

      const capacityPattern = /^[1-9][0-9]*$/;
      if(!capacityPattern.test(capacity.value)){
        invalidCapacity.innerHTML = "Capacity must be a positive integer.";
        capacity.classList.add("is-invalid");
        isValid = false;
      } else {
        invalidCapacity.innerHTML = "";
        capacity.classList.remove("is-invalid");
        capacity.classList.add("is-valid");
      }

      if (isValid){
        const course = {
          name: name.value,
          category: category.value,
          price: price.value,
          description: description.value,
          capacity: capacity.value
        };

        if (editIndex === null) {
          courses.push(course);
          Swal.fire({ icon: "success", title: "Course Added", toast: true, position: "top-end", timer: 2000, showConfirmButton: false });
        } else {
          courses[editIndex] = course;
          Swal.fire({ icon: "success", title: "Course Updated", toast: true, position: "top-end", timer: 2000, showConfirmButton: false });
          addBtn.innerText = "Add Course";
          editIndex = null;
        }

        localStorage.setItem("courses", JSON.stringify(courses));
        displayCourses();
        clearForm();
      }
    });

    function displayCourses () {
      const result = courses.map((course, index) => {
        return `
          <tr>
            <td>${index}</td>
            <td>${course.name}</td>
            <td>${course.category}</td>
            <td>${course.price}</td>
            <td>${course.description}</td>
            <td>${course.capacity}</td>
            <td>
              <button class='btn btn-warning btn-sm' onclick='editCourse(${index})'>Edit</button>
              <button class='btn btn-danger btn-sm' onclick='deleteCourse(${index})'>Delete</button>
            </td>
          </tr>
        `;
      }).join('');
      document.querySelector("#data").innerHTML = result;
    }

    function editCourse(index) {
      const course = courses[index];
      name.value = course.name;
      category.value = course.category;
      price.value = course.price;
      description.value = course.description;
      capacity.value = course.capacity;

      editIndex = index;
      addBtn.innerText = "Update Course";
    }

    function deleteCourse(index) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
      }).then((result) => {
        if (result.isConfirmed) {
          courses.splice(index, 1);
          localStorage.setItem("courses", JSON.stringify(courses));
          displayCourses();
          Swal.fire("Deleted!", "Course has been deleted.", "success");
        }
      });
    }

    deleteBtn.addEventListener("click", () => {
      Swal.fire({
        title: "Delete All?",
        text: "This will delete all courses!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete all!",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          courses = [];
          localStorage.setItem("courses", JSON.stringify(courses));
          displayCourses();
          Swal.fire("Deleted!", "All courses deleted.", "success");
        }
      });
    });

    search.addEventListener("input", () => {
      const keyword = search.value.toLowerCase();
      const filtered = courses.filter(course => course.name.toLowerCase().includes(keyword));
      const result = filtered.map((course, index) => {
        return `
          <tr>
            <td>${index}</td>
            <td>${course.name}</td>
            <td>${course.category}</td>
            <td>${course.price}</td>
            <td>${course.description}</td>
            <td>${course.capacity}</td>
            <td>
              <button class='btn btn-warning btn-sm' onclick='editCourse(${index})'>Edit</button>
              <button class='btn btn-danger btn-sm' onclick='deleteCourse(${index})'>Delete</button>
            </td>
          </tr>
        `;
      }).join('');
      document.querySelector("#data").innerHTML = result;
    });

    function clearForm() {
      name.value = "";
      category.value = "";
      price.value = "";
      description.value = "";
      capacity.value = "";
      [name, category, price, description, capacity].forEach(input => {
        input.classList.remove("is-valid", "is-invalid");
      });
      invalidName.innerHTML = "";
      invalidCategory.innerHTML = "";
      invalidPrice.innerHTML = "";
      invalidDescription.innerHTML = "";
      invalidCapacity.innerHTML = "";
    }

    window.editCourse = editCourse;
    window.deleteCourse = deleteCourse;


