"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import $ from "jquery";
import AuthMainLayout from "../layouts/auth/AuthMainLayout";
import api from "@/utils/api";


const ContactUsForm = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const authToken = useSelector((state) => state.auth.authToken);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await api.get("/contact-us", {
                    headers: {
                        Authorization: `Bearer ${authToken}`, // Send auth token
                    },
                });

                setContacts(response.data);
                setLoading(false);
            } catch (err) {
                setError("Failed to fetch contact us form data. Please try again.");
                setLoading(false);
            }
        };

        fetchContacts();

        // Cleanup DataTable on component unmount
        return () => {
    
        };
    }, [authToken]);

    return (
        <AuthMainLayout>
            <div className="container my-5">
                <h1 className="mb-4 text-center">Contact Us Form Submissions</h1>
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : error ? (
                    <div className="text-center alert alert-danger">{error}</div>
                ) : (
                    <div className="table-responsive">
                        <table
                            id="contactsTable"
                            className="table display table-striped table-bordered"
                            style={{ width: "100%" }}
                        >
                            <thead>
                                <tr>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Message</th>
                                    <th>Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {contacts.map((contact) => (
                                    <tr key={contact.id}>
                                        <td>{contact.fullName}</td>
                                        <td>{contact.email}</td>
                                        <td>{contact.contactNo}</td>
                                        <td>{contact.query}</td>
                                        <td>{new Date(contact.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AuthMainLayout>
    );
};

export default ContactUsForm;
