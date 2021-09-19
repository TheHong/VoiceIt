"""
These must agree with models/notes.tsx in the frontend
"""

class Note:
    def __init__(self, name, duration, tie=False):
        # Note: Don't nest additional objects here. If need to, edit NoteResult.to_dict
        self.name = name
        self.duration = duration
        self.tie=tie
class NoteResult:
    def __init__(self, data, info=""):
        """Result object sent via api

        Args:
            data (list[Note]): List of Note objects
            info (string, optional): String parameter that could be used
        """
        self.data = data
        self.info = info

    def to_dict(self):
        # return {"data": [datum.__dict__ for datum in self.data], "info": self.info}
        return {"data": [[note.__dict__ for note in bar] for bar in self.data], "info": self.info}

