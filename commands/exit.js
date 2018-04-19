module.exports = {
	exec : async (input, raw, shell) => {
		shell.quit();
		return false;
	}
}