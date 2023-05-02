import React, {useEffect, useState} from 'react';
import ajax from "../Services/fetchService";
import {Badge, Button, Card, Col, Row} from "react-bootstrap";
import StatusBadge from "../StatusBadge";
import {useNavigate} from "react-router-dom";
import {useUser} from "../UserProvider";

const Dashboard = () => {
    let navigate = useNavigate();
    const user = useUser();
    const [assignments, setAssignments] = useState(null);

    useEffect(() => {
        ajax("api/assignments", "GET", user.jwt)
            .then(assignmentData => {
                setAssignments(assignmentData);
            });
    }, [user.jwt])

    function createAssignment() {
        ajax("api/assignments", "POST", user.jwt)
            .then(assignment => {
                navigate(`/assignments/${assignment.id}`);
            })
    }

    return (
        <div style={{margin: "2em"}}>
            <Row>
                <Col>
                    <div
                        className="d-flex justify-content-end"
                        style={{cursor: "pointer"}}
                        onClick={() => {
                            user.setJwt(null);
                            navigate("/login")
                        }}
                    >
                        Logout
                    </div>
                </Col>
            </Row>
            <Button
                size="lg"
                className="mb-5"
                onClick={() => createAssignment()}>Submit New Assignment</Button>
            {assignments ?
                (<div
                    className="d-grid gap-5"
                    style={{gridTemplateColumns: "repeat(auto-fit, 18rem)"}}
                >
                        {assignments.map((assignment) =>
                            (<Card key={assignment.id} style={{ width: '18rem' }}>
                            <Card.Body className="d-flex flex-column justify-content-around">
                                <Card.Title>Assignment #{assignment.number}</Card.Title>
                                <div className="d-flex align-items-start">
                                    <StatusBadge text={assignment.status}/>
                                </div>
                                <Card.Text className="mt-2">
                                    <p>
                                        <b>Github URL</b>: {assignment.githubUrl}
                                    </p>
                                    <p>
                                        <b>Branch</b>: {assignment.branch}
                                    </p>
                                </Card.Text>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        navigate(`/assignments/${assignment.id}`);
                                    }}
                                >
                                    Edit
                                </Button>
                            </Card.Body>
                        </Card>))}
                    </div>): (<></>)
            }
        </div>
    );
};

export default Dashboard;