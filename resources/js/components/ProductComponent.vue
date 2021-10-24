<template>
    <div class="container my-5">
        <div class="row justify-content-end mb-3">
            <div class="col-4">
                <button class="btn btn-primary" @click="create()">
                    <i class="fas fa-plus-circle mr-2"></i>Create
                </button>
            </div>
            <div class="col-md-4">
                <form @submit.prevent="view">
                    <div class="input-group">
                        <input
                            v-model="search"
                            type="text"
                            placeholder="search"
                            class="form-control"
                        />
                        <div class="input-group-append">
                            <button type="submit" class="btn btn-primary">
                                <i class="fas fa-search"></i>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <!-- Table Start -->
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-header">
                        {{ isEditMode ? "Edit" : "Create" }}
                    </div>
                    <div class="card-body">
                        <AlertError :form="product" :message="message" />

                        <form
                            @submit.prevent="isEditMode ? update() : store()"
                            @keydown="product.onKeydown($event)"
                        >
                            <div class="form-group">
                                <label for="">Name</label>
                                <input
                                    v-model="product.name"
                                    type="text"
                                    class="form-control"
                                    :class="{
                                        'is-invalid': product.errors.has('name')
                                    }"
                                />
                                <has-error
                                    :form="product"
                                    field="name"
                                ></has-error>
                            </div>
                            <div class="form-group">
                                <label for="">Price: </label>
                                <input
                                    v-model="product.price"
                                    type="number"
                                    class="form-control"
                                    :class="{
                                        'is-invalid': product.errors.has(
                                            'price'
                                        )
                                    }"
                                />
                                <has-error
                                    :form="product"
                                    field="price"
                                ></has-error>
                            </div>

                            <button class="btn btn-primary" type="submit">
                                <i class="fas fa-save mr-1"></i> Save
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            <div class="col-md-8">
                <table class="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="product in products.data" :key="product.id">
                            <td>{{ product.id }}</td>
                            <td>{{ product.name }}</td>
                            <td>$ {{ product.price }}</td>
                            <td>
                                <button
                                    class="btn btn-primary btn-sm"
                                    @click="edit(product)"
                                >
                                    <i class="fas fa-edit mr-1"></i> Edit
                                </button>
                                <button
                                    class="btn btn-danger btn-sm"
                                    @click="destory(product.id)"
                                >
                                    <i class="fas fa-dtrash-alt mr-1"></i>Delete
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>


                <pagination
                    :data="products"
                    @pagination-change-page="view"
                ></pagination>
            </div>
        </div>
        <!-- Table End -->
    </div>
</template>

<script>
export default {
    name: "ProductComponent",
    data() {
        return {
            isEditMode: false,
            search: "",
            products: {},
            product: new Form({
                id: "",
                name: "",
                price: ""
            }),
            message: ""
        };
    },

    methods: {
        view(page = 1) {
        this.$Progress.start()
            axios
                .get(`/api/product?page=${page}&search=${this.search}`)
                .then(responese => {
                    this.products = responese.data;
                     this.$Progress.finish()
                })
                .catch(error => {
                      this.$Progress.fail()
                });
        },

        create() {
            this.product.clear();
            this.isEditMode = false;
            this.product.reset();
        },

        store() {
            this.product
                .post("/api/product")
                .then(response => {
                    this.view();
                    this.product.reset();
                       Toast.fire({
                            icon: "success",
                            title: "Inserted successfully"
                        });
                })
                .catch(error => {
                    this.message = error.responese.data.message;
                });
        },

        edit(product) {
            this.product.clear();
            this.isEditMode = true;
            this.product.fill(product);
            // this.product.id = product.id;
            // this.product.name = product.name;
            // this.product.price = product.price;
        },

        update() {
            this.product
                .put(`/api/product/${this.product.id}`, this.product)
                .then(response => {
                    this.view();
                    this.product.reset();
                       Toast.fire({
                            icon: "success",
                            title: "Updated successfully"
                        });
                })
                .catch(error => {
                    console.error(error);
                });
        },

        destory(id) {
            Swal.fire({
                title: "Are you sure?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Delete"
            }).then(result => {
                if (result.isConfirmed) {
                    axios.delete(`/api/product/${id}`).then(response => {
                        this.view();
                        Swal.fire({ title: "Deleted", icon: "success" });
                        Toast.fire({
                            icon: "success",
                            title: "Deleted successfully"
                        });
                    });
                }
            });
        }
    },

    created() {
        this.view();
    }
};
</script>
