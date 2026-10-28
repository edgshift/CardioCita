const paciente = require('../Models/pacienteMondel');
const express = require('express');

async function getPacientes(req, res){
    const pacientes = await paciente.find();
    res.json(pacientes);
};

async function getPacienteById(req, res){
    const usuario = await paciente.findById(req.params.id);
    res.status(200).json(usuario);
};

const postPaciente = async (req, res) => {
    const nuevoPaciente = new paciente(req.body);
    await nuevoPaciente.save();
    res.status(201).json(nuevoPaciente);
};

const updatePaciente = async (req, res) => {
    const usuario = await paciente.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );

    res.json(usuario);
};

const deletePaciente = async (req, res) => {
    await paciente.findByIdAndDelete(req.params.id);

    res.send({
        mensaje: `El paciente con el id ${req.params.id} esta eliminado`
    });
};

module.exports = {
    getPacientes,
    getPacienteById,
    postPaciente,
    updatePaciente,
    deletePaciente
};