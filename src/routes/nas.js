const express = require('express')
const router = express.Router()
const { exec } = require('child_process')
const sprintf = require("locutus/php/strings/sprintf")
const escapeshellarg = require('locutus/php/exec/escapeshellarg')

const getConnection = require('../database.js')

/**
 * @swagger
 * /nas-all/:
 *   get:
 *     tags:
 *     - NAS
 *     summary: Show all devices
 *     description: Show all devices
 *     produces:
 *     - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */
router.get('/nas-all/', (req, res) => {

    const queryString = "SELECT N.id,N.shortname,N.nasname,N.type,N.secret,N.description FROM nas N"
    getConnection.query(queryString, (err, rows, fields) => {
        if (err) {
            console.log("Couldn't query for NAS: " + err)
            res.sendStatus(500)
            return
        }

        console.log("Loads devices successfully")

        const nas = rows.map((row) => {
            return { id: row.id, shortname: row.shortname, ip: row.nasname, type: row.type, secret: row.secret, description: row.description }
        })

        res.json(nas)
    })
})

/**
 * @swagger
 * /nas-id/{id}:
 *   get:
 *     tags:
 *     - NAS
 *     summary: View device based on NAS ID
 *     description: View device based on NAS ID
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Enter the ID of the desired NAS
 *       required: true
 *       type: integer
 *       format: int64
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */
router.get('/nas-id/:id', (req, res) => {

    const nasId = req.params.id

    const queryString = "SELECT N.id,N.shortname,N.nasname,N.type,N.secret,N.description FROM nas N WHERE N.id = ?"
    getConnection.query(queryString, [nasId], (err, rows, fields) => {
        if (err) {
            console.log("Couldn't query for NAS: " + err)
            res.sendStatus(500)
            return
        }

        console.log("Successfully loads NASe")

        const nas = rows.map((row) => {
            return { id: row.id, shortname: row.shortname, nasname: row.nasname, type: row.type, secret: row.secret, description: row.description }
        })

        res.json(nas)
    })
})

/**
 * @swagger
 * /nas-name/{shortname}:
 *   get:
 *     tags:
 *     - NAS
 *     summary: View device based on device SHORTNAME
 *     description: View device based on device SHORTNAME
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: shortname
 *       in: path
 *       description: Enter the shortname of the NAS
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */
router.get('/nas-name/:shortname', (req, res) => {

    const nasName = req.params.shortname

    const queryString = "SELECT N.id,N.shortname,N.nasname,N.type,N.secret,N.description FROM nas N WHERE N.shortname = ?"
    getConnection.query(queryString, [nasName], (err, rows, fields) => {
        if (err) {
            console.log("Couldn't query for NAS: " + err)
            res.sendStatus(500)
            return
        }

        console.log("Successfully loads NAS")

        const nas = rows.map((row) => {
            return { id: row.id, shortname: row.shortname, nasname: row.nasname, type: row.type, secret: row.secret, description: row.description }
        })

        res.json(nas)
    })
})

/**
 * @swagger
 * /nas-ip/{nasname}:
 *   get:
 *     tags:
 *     - NAS
 *     summary: View NAS based on device NASNAME
 *     description: View NAS based on device NASNAME
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: nasname
 *       in: path
 *       description: Enter the NASNAME of the device
 *       required: true
 *       type: string
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */
router.get('/nas-ip/:nasname', (req, res) => {

    const nasIp = req.params.nasname

    const queryString = "SELECT N.id,N.shortname,N.nasname,N.type,N.secret,N.description FROM nas N WHERE N.nasname = ?"
    getConnection.query(queryString, [nasIp], (err, rows, fields) => {
        if (err) {
            console.log("Couldn't query for NAS: " + err)
            res.sendStatus(500)
            return
        }

        console.log("Successfully loads NAS")

        const nas = rows.map((row) => {
            return { id: row.id, shortname: row.shortname, nasname: row.nasname, typ: row.type, secret: row.secret, description: row.description }
        })

        res.json(nas)
    })
})

/**
 * @swagger
 * /nas-delete-id/{id}:
 *   delete:
 *     tags:
 *     - NAS
 *     summary: Delete NAS based on it's ID
 *     description: Delete NAS based on it's ID
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: id
 *       in: path
 *       description: Enter the ID of NAS
 *       type: integer
 *       format: int64
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */
router.delete('/nas-delete-id/:id', (req, res) => {

    console.log("Deleting NAS with id: " + req.params.id)

    const nasId = req.params.id

    const queryString = "DELETE nas FROM nas WHERE nas.id = ?"
    getConnection.query(queryString, [nasId], (err, rows, fields) => {
        if (err) {
            console.log("Couldn't query for NAS: " + err)
            res.sendStatus(500)
            return
        }

        console.log("NAS successfully wiped")

        res.send('NAS successfully wiped with id ' + req.params.id)
    })
})

/**
 * @swagger
 * /nas-delete-name/{shortname}:
 *   delete:
 *     tags:
 *     - NAS
 *     summary: Delete NAS based on it's SHORTNAME
 *     description: Delete NAS based on it's SHORTNAME
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: shortname
 *       in: path
 *       description: Enter the SHORTNAME of NAS
 *       type: string
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */
router.delete('/nas-delete-name/:shortname', (req, res) => {

    console.log("Deleting NAS with SHORTNAME: " + req.params.shortname)

    const nasName = req.params.shortname

    const queryString = "DELETE nas FROM nas WHERE nas.shortname = ?"
    getConnection.query(queryString, [nasName], (err, rows, fields) => {
        if (err) {
            console.log("Couldn't query for NAS: " + err)
            res.sendStatus(500)
            return
        }

        console.log("NAS successfully wiped")

        res.send('NAS successfully wiped with shortname ' + req.params.shortname)
    })
})

/**
 * @swagger
 * /nas-delete-ip/{nasname}:
 *   delete:
 *     tags:
 *     - NAS
 *     summary: Delete NAS based on it's NASNAME
 *     description: Delete NAS based on it's NASNAME
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: nasname
 *       in: path
 *       description: Enter the NASNAME of device
 *       type: string
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */
router.delete('/nas-delete-ip/:nasname', (req, res) => {

    console.log("Deleting NAS with NASNAME: " + req.params.nasname)

    const nasIp = req.params.nasname

    const queryString = "DELETE nas FROM nas WHERE nas.nasname = ?"
    getConnection.query(queryString, [nasIp], (err, rows, fields) => {
        if (err) {
            console.log("Couldn't query for NAS: " + err)
            res.sendStatus(500)
            return
        }

        console.log("Device successfully wiped")

        res.send('NAS successfully wiped with NASNAME ' + req.params.nasname)
    })
})

/**
 * @swagger
 * /nas-create/:
 *   post:
 *     tags:
 *     - NAS
 *     summary: Add a new NAS
 *     description: Add a new NAS
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: body
 *       in: body
 *       description: Enter parameters for new NAS, ID will be filled in automatically
 *       required: true
 *       schema:
 *          type: object
 *          $ref: '#/definitions/Nas'
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */
router.post('/nas-create/', (req, res) => {
    const { nasname, shortname, type, secret, description } = req.body
    console.log(nasname, shortname, type, secret, description)
    const query = `
    SET @nasname = ?;
    SET @shortname = ?;
    SET @type = ?;
    SET @secret = ?;
    SET @description = ?;
    CALL nasAdd(@nasname, @shortname, @type, @secret, @description);
  `
    getConnection.query(query, [nasname, shortname, type, secret, description], (err, rows, fields) => {
        if (!err) {
            res.json({ status: 'New NAS added' })
        } else {
            console.log(err);
        }
    })
})

/**
 * @swagger
 * /nas-disconnect-request/:
 *   post:
 *     tags:
 *     - NAS
 *     summary: Send a disconnect request
 *     description: Send a disconnect request
 *     produces:
 *     - application/json
 *     parameters:
 *     - name: body
 *       in: body
 *       description: Enter parameters to send disconnect request
 *       required: true
 *       schema:
 *          type: object
 *          $ref: '#/definitions/Nas-PoD'
 *     responses:
 *       200:
 *         description: Ok
 *       500:
 *         description: Internal Server Error
 */
router.post('/nas-disconnect-request/', (req, res) => {
    const { username, server, port, secret } = req.body
    const queryString = sprintf("SELECT COUNT(*) AS is_online FROM radacct WHERE username = '%s' AND (AcctStopTime IS NULL OR AcctStopTime='0000-00-00 00:00:00')", username)
    getConnection.query(queryString, (err, row) => {
        if (err) {
            console.log("Failed to query for: " + err)
            res.sendStatus(500)
            return
        } else if (row[0].is_online <= 0) {
            res.send('No user found online with Username: ' + username)
            return
        }

        const query = sprintf("User-Name=%s", escapeshellarg(username))
        const radclient_path = '/usr/bin/radclient'
        const radclient_options = sprintf(" -c %s -n %s -r %s -t %s %s", escapeshellarg('1'), escapeshellarg('3'), escapeshellarg('3'), escapeshellarg('3'), '-x')
        const server_port = sprintf("%s:%d", server, port);
        const positional_args = sprintf("%s %s %s", server_port, escapeshellarg('disconnect'), escapeshellarg(secret));
        const args = sprintf('echo "%s" | %s %s %s 2>&1', query, radclient_path, radclient_options, positional_args)
        console.log(args)
        // run the `ls` command using exec
        exec(args, (err, output) => {
            // once the command has completed, the callback function is called
            if (err) {
                // log and return if we encounter an error
                console.error("could not execute command: ", err)
                res.sendStatus(500)
                return
            }
            // log the output received from the command
            console.log("Output: \n", output)
            const successMsg = sprintf('Performed disconnect action on user <strong>%s</strong><pre class="font-monospace my-1">%s</pre>', username, output);
            res.send(successMsg)
        })
    })
})

module.exports = router